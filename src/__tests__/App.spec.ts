import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'
import App from '../App.vue'
import { useModalStore } from '../stores/modalStore'

const mockAllSteps = ref([
    { path: '/step-1', sub: null },
    { path: '/step-2', sub: null },
    { path: '/step-3', sub: 1 },
])

vi.mock('../composables/useNavigation', () => ({
    useNavigation: () => ({
        allSteps: mockAllSteps,
    }),
}))

vi.mock('../composables/useGuidingIdeasNew', () => ({
    useGuidingIdeasNew: () => ({
        topPerformers: { value: [] },
        badPerformers: { value: [] },
        calculatedAreas: { value: [] },
        isLoading: { value: false },
    }),
}))

vi.mock('../composables/useCompetencesNew', () => ({
    useCompetencesNew: () => ({
        topPerformers: { value: [] },
    }),
}))

vi.mock('../services/configService', () => ({
    configJson: {
        start: {
            title: 'Test Titel',
            info: { text: 'Satz eins. Satz zwei.', important: 'Wichtiger Hinweis' },
        },
    },
}))

const i18n = createI18n({
    legacy: false,
    locale: 'de',
    messages: {
        de: {
            accessibility: {
                pagination: 'Pagination',
                prev_page: 'Vorherige Seite',
                next_page: 'Nächste Seite',
                go_to_page: 'Gehe zu Seite {num}',
            },
            home: { feedback: 'Feedback' },
            competence: { show_details_label: 'Details anzeigen' },
        },
    },
})

describe('App.vue', () => {
    let router: ReturnType<typeof createRouter>

    const createWrapper = () => {
        return mount(App, {
            global: {
                plugins: [router, i18n, createTestingPinia({ createSpy: vi.fn })],
                stubs: {
                    IconPageLeft: true,
                    IconPageRight: true,
                    InfoIcon: true,
                    SideModal: true,
                    RouterView: true,
                },
            },
        })
    }

    beforeEach(() => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', component: { template: '<div>Home</div>' } },
                { path: '/step-1', component: { template: '<div>Step 1</div>' } },
                { path: '/step-2', component: { template: '<div>Step 2</div>' } },
                { path: '/step-3/:subId?', component: { template: '<div>Step 3</div>' } },
            ],
        })
    })

    it('rendert die Komponente und versteckt den Footer auf der Startseite (isHome)', async () => {
        await router.push('/')
        await router.isReady()
        const wrapper = createWrapper()

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('footer').exists()).toBe(false)
    })

    it('zeigt den Footer auf Schritt 2 an und berechnet den richtigen Hintergrund', async () => {
        await router.push('/step-2')
        await router.isReady()
        const wrapper = createWrapper()

        expect(wrapper.find('footer').exists()).toBe(true)
        const gridDiv = wrapper.find('div')
        expect(gridDiv.attributes('style')).toContain('linear-gradient')
    })

    it('wechselt die Hintergrundfarbe ab Schritt 3', async () => {
        await router.push('/step-3/1')
        await router.isReady()
        const wrapper = createWrapper()

        const gridDiv = wrapper.find('div')
        expect(gridDiv.attributes('style')).toContain('var(--color-turquise)')
    })

    it('navigiert vor und zurück mit den Buttons', async () => {
        await router.push({ path: '/step-2', query: { user: '123' } })
        await router.isReady()
        const wrapper = createWrapper()

        const prevBtn = wrapper.find('button[aria-label="Vorherige Seite"]')
        const nextBtn = wrapper.find('button[aria-label="Nächste Seite"]')

        await prevBtn.trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/step-1')
        expect(router.currentRoute.value.query.user).toBe('123')

        await router.push({ path: '/step-2', query: { user: '123' } })
        await router.isReady()
        await wrapper.vm.$nextTick()

        await nextBtn.trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/step-3/1')
    })

    it('navigiert über die Page-Dots (goTo)', async () => {
        await router.push('/step-2')
        await router.isReady()
        const wrapper = createWrapper()

        const dots = wrapper.findAll('ul button')
        expect(dots.length).toBe(3)

        await dots[2]?.trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/step-3/1')
    })

    it('öffnet das Modal mit aufbereitetem Inhalt beim Klick auf den Info-Button', async () => {
        await router.push('/step-2')
        await router.isReady()
        const wrapper = createWrapper()

        const modalStore = useModalStore()
        const infoBtn = wrapper.find('button[aria-label="Details anzeigen"]')

        await infoBtn.trigger('click')

        expect(modalStore.openModal).toHaveBeenCalledWith(
            'Test Titel',
            'Satz eins.<br><br>Satz zwei.<br><br><br><br><strong>Wichtiger Hinweis</strong>',
        )
    })
})
