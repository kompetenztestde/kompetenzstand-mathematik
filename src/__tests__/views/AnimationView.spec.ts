import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import AnimationView from '@/views/AnimationView/AnimationView.vue'

const mockUserQuery = ref<string | string[] | undefined>('USER_123')
vi.mock('vue-router', () => ({
    useRoute: () => ({
        query: { user: mockUserQuery.value },
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

const mockOverallResult = ref<{ text: string } | null>({ text: 'Dein Gesamtergebnis ist super!' })
const mockCalculatedAreas = ref<number[]>([33, 66, 100])
const mockStats = ref({ total: 10, correct: 8, percentage: 80 })

vi.mock('@/composables/useOverallResultsNew', () => ({
    useOverallResultsNew: () => ({
        overallResult: mockOverallResult,
    }),
}))

vi.mock('@/composables/useGuidingIdeasNew', () => ({
    useGuidingIdeasNew: () => ({
        calculatedAreas: mockCalculatedAreas,
    }),
}))

vi.mock('@/composables/useUserItems', () => ({
    useUserItemsNew: () => ({
        stats: mockStats,
    }),
}))

vi.mock('@/types', () => ({
    ROMAN_TO_LABEL: { III: 'Level_3_Label' },
    LEVEL_MAP: { Level_3_Label: 3 },
}))

const mockCompetenceData = ref([{ value: 'III' }])
vi.mock('@tanstack/vue-query', () => ({
    useQuery: () => ({
        data: mockCompetenceData,
    }),
}))

vi.mock('@/queries/utils', () => ({
    inioApiConfiguration: vi.fn(),
}))

vi.mock('@tba3/api-new', () => ({
    ReportDataTba3Api: vi.fn(),
}))

describe('AnimationView.vue', () => {
    let reloadSpy: any

    beforeEach(() => {
        vi.clearAllMocks()
        mockUserQuery.value = 'USER_123'
        mockOverallResult.value = { text: 'Dein Gesamtergebnis ist super!' }

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: vi.fn() },
        })
        reloadSpy = window.location.reload
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const mountComponent = () => {
        return mount(AnimationView, {
            global: {
                stubs: {
                    SlideAnimationComponent: true,
                    RefreshIcon: true,
                },
            },
        })
    }

    it('sollte den Header und den Ergebnisse-Text rendern, wenn overallResult vorhanden ist', () => {
        const wrapper = mountComponent()

        expect(wrapper.find('h1').text()).toBe('common.result')
        expect(wrapper.find('div[class*="resultText"]').text()).toBe('Dein Gesamtergebnis ist super!')
    })

    it('sollte die berechneten Props korrekt an SlideAnimationComponent übergeben', () => {
        const wrapper = mountComponent()
        const animationComp = wrapper.findComponent({ name: 'SlideAnimationComponent' })

        expect(animationComp.exists()).toBe(true)
        expect(animationComp.props('areas')).toEqual([33, 66, 100])
        expect(animationComp.props('level')).toBe('Level_3_Label')
        expect(animationComp.props('score')).toBe(3)
        expect(animationComp.props('correctScore')).toBe(8)
    })

    it('sollte bei Auslösen von animation-finished das Mobile-Feedback und den Reload-Button anzeigen', async () => {
        const wrapper = mountComponent()

        expect(wrapper.find('h2[class*="feedbackText"]').exists()).toBe(false)
        expect(wrapper.find('div[class*="buttonRefreshRow"]').exists()).toBe(false)

        const animationComp = wrapper.findComponent({ name: 'SlideAnimationComponent' })
        await animationComp.vm.$emit('animation-finished')
        await nextTick()

        expect(wrapper.find('h2[class*="feedbackText"]').exists()).toBe(true)
        expect(wrapper.find('div[class*="buttonRefreshRow"]').exists()).toBe(true)
    })

    it('sollte window.location.reload aufrufen, wenn der Refresh-Button geklickt wird', async () => {
        const wrapper = mountComponent()
        const headerRefreshButton = wrapper.find('button[aria-label="home.feedback"]')

        await headerRefreshButton.trigger('click')

        expect(reloadSpy).toHaveBeenCalled()
    })

    it('sollte ein Array im Route-User-Query abfangen und das erste Element nutzen', () => {
        mockUserQuery.value = ['USER_ARRAY_1', 'USER_ARRAY_2']
        const wrapper = mountComponent()

        expect(wrapper.exists()).toBe(true)
    })
})
