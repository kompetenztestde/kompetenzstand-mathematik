import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import SpecialView from '@/views/SpecialView/SpecialView.vue'

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

const mockUserData = ref<any[] | null>(null)
const mockSpecialCaseResult = ref<any>(null)

vi.mock('@/composables/useUserItems', () => ({
    useUserItemsNew: () => ({
        data: mockUserData,
    }),
}))

vi.mock('@/composables/useSpecialCasesNew', () => ({
    useSpecialCasesNew: () => ({
        specialCaseResult: mockSpecialCaseResult,
    }),
}))

describe('SpecialView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUserData.value = null
        mockSpecialCaseResult.value = null
    })

    const mountComponent = () => {
        return mount(SpecialView, {
            global: {
                stubs: {
                    StackedBarChart: true,
                },
            },
        })
    }

    it('sollte mit leeren Werten rendern, wenn keine Daten geladen sind', () => {
        const wrapper = mountComponent()

        expect(wrapper.find('h1').text()).toBe('specialView.title')

        const chart = wrapper.findComponent({ name: 'StackedBarChart' })
        expect(chart.exists()).toBe(true)
        expect(chart.props('correctAnswers')).toBe(0)
        expect(chart.props('falseAnswers')).toBe(0)
        expect(chart.props('notWorkedOn')).toBe(0)
        expect(chart.props('total')).toBe(0)
    })

    it('sollte Aufgabenverteilung (correct, failed, notWorkedOn, total) korrekt berechnen', async () => {
        mockUserData.value = [
            { descriptiveStatistics: { frequency: 1 } },
            { descriptiveStatistics: { frequency: 1 } },
            { descriptiveStatistics: { frequency: 0 } },
            { descriptiveStatistics: { frequency: -1 } },
        ]

        const wrapper = mountComponent()
        await wrapper.vm.$nextTick()

        const chart = wrapper.findComponent({ name: 'StackedBarChart' })
        expect(chart.props('correctAnswers')).toBe(2)
        expect(chart.props('falseAnswers')).toBe(1)
        expect(chart.props('notWorkedOn')).toBe(1)
        expect(chart.props('total')).toBe(4)
    })

    it('sollte Ergebnis- und Ratschlagtexte anzeigen, wenn specialCaseResult vorhanden ist', async () => {
        mockSpecialCaseResult.value = {
            resultAndAdvice: {
                result: 'Testergebnis Text',
                advice: 'Empfehlung Text',
            },
        }

        const wrapper = mountComponent()
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Testergebnis Text')
        expect(wrapper.text()).toContain('Empfehlung Text')
    })
})
