import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed, ref } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { useSpecialCasesNew, useUserProperties } from '@/composables/useSpecialCasesNew'

const mockItems = ref<any[]>([])

vi.mock('@/composables/useUserItems', () => ({
    useUserItemsNew: () => ({
        data: mockItems,
    }),
}))

vi.mock('@/queries/utils', () => ({
    inioApiConfiguration: vi.fn().mockResolvedValue({}),
}))

const mockGetItemsGet = vi.fn()
const mockGetAggregationsGet = vi.fn()

vi.mock('@tba3/api-new', () => ({
    ReportDataTba3Api: vi.fn().mockImplementation(function () {
        return {
            testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet: mockGetItemsGet,
            testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet: mockGetAggregationsGet,
        }
    }),
}))

vi.mock('@/services/configService', () => ({
    configJson: {
        specialCases: {
            K1A: 'Text K1A',
            K1B: 'Text K1B',
            K2: 'Text K2',
            K3: 'Text K3',
            K4: 'Text K4',
            K5: 'Text K5',
        },
        specialCasesAdvices: {
            K1A: 'Advice K1A',
            K1B: 'Advice K1B',
            K2: 'Advice K2',
            K3: 'Advice K3',
            K4: 'Advice K4',
            K5: 'Advice K5',
        },
    },
}))

function withVueQuery<T>(composableFn: () => T) {
    let result: T
    const TestComponent = {
        setup() {
            result = composableFn()
            return () => null
        },
    }

    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    })

    mount(TestComponent, {
        global: {
            plugins: [[VueQueryPlugin, { queryClient }]],
        },
    })

    return result!
}

describe('useSpecialCasesNew', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockItems.value = []
    })

    const setupMocks = (aggregations: any[], properties: any[] = []) => {
        mockGetAggregationsGet.mockResolvedValue({
            data: {
                studentsData: [{ code: 'CODE_123', aggregations }],
            },
        })
        mockGetItemsGet.mockResolvedValue({
            data: {
                studentsData: [{ code: 'CODE_123', properties }],
            },
        })
    }

    it('sollte null zurückgeben, wenn keine Aggregations vorhanden sind', async () => {
        setupMocks([])
        const code = computed(() => 'CODE_123')
        const { specialCaseResult } = withVueQuery(() => useSpecialCasesNew(code))

        await new Promise((r) => setTimeout(r, 0))

        expect(specialCaseResult.value).toBeNull()
    })

    it('sollte K5 zurückgeben, wenn der Mittelwert >= 90 ist', async () => {
        setupMocks([{ descriptiveStatistics: { mean: 95, frequency: 1, total: 1 } }])

        const code = computed(() => 'CODE_123')
        const { specialCaseResult } = withVueQuery(() => useSpecialCasesNew(code))

        await new Promise((r) => setTimeout(r, 0))

        expect(specialCaseResult.value?.key).toBe('K5')
        expect(specialCaseResult.value?.text).toBe('Text K5')
        expect(specialCaseResult.value?.resultAndAdvice).toBe('Advice K5')
    })

    it('sollte K3 zurückgeben, wenn der Mittelwert <= 10 ist', async () => {
        setupMocks([{ descriptiveStatistics: { mean: 5, frequency: 1, total: 1 } }])

        const code = computed(() => 'CODE_123')
        const { specialCaseResult } = withVueQuery(() => useSpecialCasesNew(code))

        await new Promise((r) => setTimeout(r, 0))

        expect(specialCaseResult.value?.key).toBe('K3')
    })

    it('sollte K2 zurückgeben, wenn der Total Score 0 beträgt', async () => {
        setupMocks([{ descriptiveStatistics: { mean: 50, frequency: 0, total: 1 } }])

        const code = computed(() => 'CODE_123')
        const { specialCaseResult } = withVueQuery(() => useSpecialCasesNew(code))

        await new Promise((r) => setTimeout(r, 0))

        expect(specialCaseResult.value?.key).toBe('K2')
        expect(specialCaseResult.value?.score).toBe(0)
    })

    it('sollte K1A zurückgeben, wenn die Bearbeitungsdauer zwischen 40 und 60 Minuten liegt', async () => {
        setupMocks(
            [{ descriptiveStatistics: { mean: 50, frequency: 1, total: 1 } }],
            [
                { key: 'startTime', value: '2026-03-30T10:00:00Z' },
                { key: 'endTime', value: '2026-03-30T10:50:00Z' },
            ]
        )

        const code = computed(() => 'CODE_123')
        const { specialCaseResult } = withVueQuery(() => useSpecialCasesNew(code))

        await new Promise((r) => setTimeout(r, 0))

        expect(specialCaseResult.value?.key).toBe('K1A')
    })

    it('sollte K1B zurückgeben, wenn Dauer > 70 Minuten, Nicht-Bearbeitet-Quote < 0.5 und Erfolgsquote >= 2/3', async () => {
        setupMocks(
            [{ descriptiveStatistics: { mean: 50, frequency: 1, total: 1 } }],
            [
                { key: 'startTime', value: '2026-03-30T10:00:00Z' },
                { key: 'endTime', value: '2026-03-30T11:20:00Z' },
            ]
        )
        mockItems.value = [
            { descriptiveStatistics: { frequency: 1 } },
            { descriptiveStatistics: { frequency: 1 } },
            { descriptiveStatistics: { frequency: 0 } },
        ]

        const code = computed(() => 'CODE_123')
        const { specialCaseResult } = withVueQuery(() => useSpecialCasesNew(code))

        await new Promise((r) => setTimeout(r, 0))

        expect(specialCaseResult.value?.key).toBe('K1B')
    })

    it('sollte K4 als Fallback zurückgeben, wenn Dauer > 70 Minuten aber Kriterien für K1B nicht erfüllt sind', async () => {
        setupMocks(
            [{ descriptiveStatistics: { mean: 50, frequency: 1, total: 1 } }],
            [
                { key: 'startTime', value: '2026-03-30T10:00:00Z' },
                { key: 'endTime', value: '2026-03-30T11:20:00Z' }, 
            ]
        )
        mockItems.value = [
            { descriptiveStatistics: { frequency: 0 } },
            { descriptiveStatistics: { frequency: 0 } },
            { descriptiveStatistics: { frequency: 1 } },
        ]

        const code = computed(() => 'CODE_123')
        const { specialCaseResult } = withVueQuery(() => useSpecialCasesNew(code))

        await new Promise((r) => setTimeout(r, 0))

        expect(specialCaseResult.value?.key).toBe('K4')
    })

    describe('useUserProperties', () => {
        it('sollte User-Properties für den angegebenen Code abrufen', async () => {
            setupMocks([], [{ key: 'startTime', value: '2026-03-30T10:00:00Z' }])

            const code = computed(() => 'CODE_123')
            const result = withVueQuery(() => useUserProperties(code))

            await result.refetch()

            expect(result.properties.value).toEqual([
                { key: 'startTime', value: '2026-03-30T10:00:00Z' },
            ])
        })
    })
})