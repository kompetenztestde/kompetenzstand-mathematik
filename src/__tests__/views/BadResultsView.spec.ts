import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import BadResultsView from '@/views/BadResultsView/BadResultsView.vue'
import { useModalStore } from '@/stores/modalStore'

vi.mock('vue-router', () => ({
    useRoute: () => ({
        query: { user: 'USER_123' },
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

const mockBadPerformers = ref<any[]>([])
const mockCalculatedAreas = ref<number[]>([33, 66, 100])

vi.mock('@/composables/useGuidingIdeasNew', () => ({
    useGuidingIdeasNew: () => ({
        badPerformers: mockBadPerformers,
        calculatedAreas: mockCalculatedAreas,
    }),
}))

describe('BadResultsView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        setActivePinia(createPinia())
        mockBadPerformers.value = []
        mockCalculatedAreas.value = [33, 66, 100]
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const mountComponent = () => {
        return mount(BadResultsView, {
            global: {
                plugins: [setActivePinia(createPinia())],
                stubs: {
                    GuidingIdeaComponent: true,
                    BarCharts: true,
                    SingleBarCharts: true,
                    InfoIcon: true,
                },
            },
        })
    }

    const setWindowWidth = async (wrapper: any, width: number) => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width })
        window.dispatchEvent(new Event('resize'))
        await nextTick()
    }

    it('sollte GuidingIdeaComponent rendern, wenn badPerformers <= 2 ist', () => {
        mockBadPerformers.value = [
            { label: 'Idee 1', percentage: 50, areas: [33, 66, 100] },
            { label: 'Idee 2', percentage: 40, areas: [33, 66, 100] },
        ]

        const wrapper = mountComponent()

        expect(wrapper.findComponent({ name: 'GuidingIdeaComponent' }).exists()).toBe(true)
        expect(wrapper.find('h1').exists()).toBe(false)
    })

    it('sollte das Multi-Bad-Layout und BarCharts auf Desktop rendern, wenn badPerformers > 2 ist', () => {
        mockBadPerformers.value = [
            { label: 'Idee 1', percentage: 50, areas: [33, 66, 100] },
            { label: 'Idee 2', percentage: 40, areas: [33, 66, 100] },
            { label: 'Idee 3', percentage: 30, areas: [33, 66, 100] },
        ]

        const wrapper = mountComponent()

        expect(wrapper.findComponent({ name: 'GuidingIdeaComponent' }).exists()).toBe(false)
        expect(wrapper.find('h1').text()).toBe('badResults.title')
        expect(wrapper.findComponent({ name: 'BarCharts' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'SingleBarCharts' }).exists()).toBe(false)
    })

    it('sollte auf Mobile (Breite < 768px) SingleBarCharts und Mobile-Elemente rendern', async () => {
        mockBadPerformers.value = [
            { label: 'Idee 1', percentage: 50, areas: [33, 66, 100] },
            { label: 'Idee 2', percentage: 40, areas: [33, 66, 100] },
            { label: 'Idee 3', percentage: 30, areas: [33, 66, 100] },
        ]

        const wrapper = mountComponent()
        await setWindowWidth(wrapper, 500)

        expect(wrapper.findComponent({ name: 'BarCharts' }).exists()).toBe(false)
        expect(wrapper.findAllComponents({ name: 'SingleBarCharts' }).length).toBe(3)
        expect(wrapper.find('img').exists()).toBe(true)
    })

    it('sollte das Modal öffnen, wenn eine Mobile-Karte geklickt wird', async () => {
        mockBadPerformers.value = [
            { label: 'Idee 1', description: 'Detailbeschreibung 1', percentage: 50, areas: [33, 66, 100] },
            { label: 'Idee 2', text: 'Text 2', percentage: 40, areas: [33, 66, 100] },
            { label: 'Idee 3', percentage: 30, areas: [33, 66, 100] },
        ]

        const wrapper = mountComponent()
        await setWindowWidth(wrapper, 500)

        const modalStore = useModalStore()
        const openModalSpy = vi.spyOn(modalStore, 'openModal')

        const firstCardHeader = wrapper.findAll('div[class*="mobileCardHeader"]')[0]
        await firstCardHeader?.trigger('click')

        expect(openModalSpy).toHaveBeenCalledWith('Idee 1', 'Detailbeschreibung 1')
    })

    it('sollte den EventListener für window resize beim Mounten registrieren und beim Unmounten entfernen', () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

        const wrapper = mountComponent()
        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

        wrapper.unmount()
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })
})