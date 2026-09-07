import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import CompetenceView from '@/views/CompetenceView/CompetenceView.vue'
import { useModalStore } from '@/stores/modalStore'

const mockRoute = {
    query: { user: 'USER_123' },
    params: { subId: '0' },
}

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

const mockTopPerformers = ref<any[]>([])

vi.mock('@/composables/useCompetencesNew', () => ({
    useCompetencesNew: () => ({
        topPerformers: mockTopPerformers,
    }),
}))

describe('CompetenceView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        setActivePinia(createPinia())
        mockRoute.params.subId = '0'
        mockTopPerformers.value = [
            {
                label: 'Kompetenz 1',
                text: 'Ergebnistext 1',
                description: 'Detaillierte Beschreibung 1',
            },
            {
                label: 'Kompetenz 2',
                text: 'Ergebnistext 2',
                description: 'Detaillierte Beschreibung 2',
            },
        ]
    })

    const mountComponent = () => {
        return mount(CompetenceView, {
            global: {
                plugins: [setActivePinia(createPinia())],
                stubs: {
                    Confetti: true,
                    InfoIcon: true,
                },
            },
        })
    }

    it('sollte das aktuelle Item basierend auf subId 0 rendern', () => {
        const wrapper = mountComponent()

        expect(wrapper.text()).toContain('Kompetenz 1')
        expect(wrapper.text()).toContain('Ergebnistext 1')
        expect(wrapper.findComponent({ name: 'Confetti' }).exists()).toBe(true)
    })

    it('sollte das zweite Item rendern, wenn subId auf 1 steht', async () => {
        mockRoute.params.subId = '1'
        const wrapper = mountComponent()

        expect(wrapper.text()).toContain('Kompetenz 2')
        expect(wrapper.text()).toContain('Ergebnistext 2')
    })

    it('sollte das Modal öffnen, wenn showDetails aufgerufen wird (Klick auf Titel/Button)', async () => {
        const wrapper = mountComponent()
        const modalStore = useModalStore()
        const openModalSpy = vi.spyOn(modalStore, 'openModal')

        const titleRow = wrapper.find('div[class*="titleRow"]')
        await titleRow.trigger('click')

        expect(openModalSpy).toHaveBeenCalledWith('Kompetenz 1', 'Detaillierte Beschreibung 1')
    })

    it('sollte nichts rendern, wenn kein currentItem vorhanden ist', () => {
        mockTopPerformers.value = []
        const wrapper = mountComponent()

        expect(wrapper.find('h1').exists()).toBe(false)
    })
})
