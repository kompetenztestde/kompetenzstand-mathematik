import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import App from '../App.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/step-1', component: { template: '<div>Step 1</div>' } },
    ],
})

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
            home: {
                feedback: 'Feedback',
            },
            competence: {
                show_details_label: 'Details anzeigen',
            },
        },
    },
})

vi.mock('@/composables/useGuidingIdeasNew', () => ({
    useGuidingIdeasNew: () => ({
        topPerformers: { value: [] },
        badPerformers: { value: [] },
        calculatedAreas: { value: [] },
        isLoading: { value: false },
    }),
}))

vi.mock('@/composables/useCompetencesNew', () => ({
    useCompetencesNew: () => ({
        topPerformers: { value: [] },
    }),
}))

vi.mock('@/services/configService', () => ({
    configJson: {
        start: {
            title: 'Titel',
            info: { text: 'Info Text', important: 'Wichtig' },
        },
    },
}))

describe('App', () => {
    it('rendert die App-Komponente erfolgreich', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(App, {
            global: {
                plugins: [router, i18n, createTestingPinia({ createSpy: vi.fn })],
                stubs: {
                    IconPageLeft: true,
                    IconPageRight: true,
                    InfoIcon: true,
                    SideModal: true,
                },
            },
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('main').exists()).toBe(true)
    })
})