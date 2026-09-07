import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { useUserItems, useUserItemsNew, calculateUserStats, useSchoolForm, useTestData } from '@/composables/useUserItems'

vi.mock('@/queries/utils', () => ({
    apiConfiguration: vi.fn().mockResolvedValue({}),
    inioApiConfiguration: vi.fn().mockResolvedValue({}),
}))

const mockGetGroupItems = vi.fn()
const mockGetItemsGet = vi.fn()
const mockGetTestsGet = vi.fn()

vi.mock('@tba3/api-resources', () => ({
    GroupsApi: vi.fn().mockImplementation(function () {
        return { getGroupItems: mockGetGroupItems }
    }),
}))

vi.mock('@tba3/api-new', () => ({
    ReportDataTba3Api: vi.fn().mockImplementation(function () {
        return {
            testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet: mockGetItemsGet,
            testGroupsTgIdTestsGet: mockGetTestsGet,
        }
    }),
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
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    mount(TestComponent, {
        global: {
            plugins: [[VueQueryPlugin, { queryClient }]],
        },
    })

    return result!
}

describe('useUserItems Module', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('calculateUserStats', () => {
        it('sollte 0-Werte zurückgeben, wenn keine Items übergeben werden', () => {
            expect(calculateUserStats(undefined)).toEqual({ correct: 0, total: 0, percentage: 0 })
            expect(calculateUserStats([])).toEqual({ correct: 0, total: 0, percentage: 0 })
        })

        it('sollte die Richtig-Quote und Prozentzahl korrekt berechnen', () => {
            const items = [
                { descriptiveStatistics: { frequency: 1 } },
                { descriptiveStatistics: { frequency: 0 } },
                { descriptiveStatistics: { frequency: 1 } },
                { descriptiveStatistics: { frequency: -1 } },
            ]

            const stats = calculateUserStats(items)
            expect(stats).toEqual({
                correct: 2,
                total: 4,
                percentage: 50,
            })
        })
    })

    describe('useUserItems', () => {
        it('sollte Items für den angegebenen User abrufen', async () => {
            const mockUsers = [
                { name: 'user1', items: [{ id: 1 }, { id: 2 }] },
                { name: 'user2', items: [{ id: 3 }] },
            ]
            mockGetGroupItems.mockResolvedValue(mockUsers)

            const userName = computed(() => 'user1')
            const query = withVueQuery(() => useUserItems(userName))

            const items = await query.refetch()
            expect(items.data).toEqual([{ id: 1 }, { id: 2 }])
            expect(mockGetGroupItems).toHaveBeenCalledWith({ id: '8b-mathe', type: 'students' })
        })

        it('sollte deaktiviert sein, wenn kein userName gesetzt ist', () => {
            const userName = computed(() => undefined)
            const query = withVueQuery(() => useUserItems(userName))

            expect(query.isEnabled.value).toBe(false)
        })
    })

    describe('useUserItemsNew', () => {
        it('sollte User-Items abrufen und Stats berechnen', async () => {
            mockGetItemsGet.mockResolvedValue({
                data: {
                    studentsData: [
                        {
                            code: 'CODE_123',
                            items: [{ descriptiveStatistics: { frequency: 1 } }, { descriptiveStatistics: { frequency: 0 } }],
                        },
                    ],
                },
            })

            const code = computed(() => 'CODE_123')
            const result = withVueQuery(() => useUserItemsNew(code))

            await result.refetch()

            expect(result.data.value).toEqual([{ descriptiveStatistics: { frequency: 1 } }, { descriptiveStatistics: { frequency: 0 } }])
            expect(result.stats.value).toEqual({
                correct: 1,
                total: 2,
                percentage: 50,
            })
        })
    })

    describe('useSchoolForm', () => {
        it('sollte die Schulform aus den Gruppendaten zurückgeben', async () => {
            mockGetItemsGet.mockResolvedValue({
                data: {
                    groupData: {
                        schoolForm: 'Gymnasium',
                    },
                },
            })

            const code = computed(() => 'CODE_123')
            const query = withVueQuery(() => useSchoolForm(code))

            const response = await query.refetch()
            expect(response.data).toBe('Gymnasium')
        })

        it('sollte null zurückgeben, wenn keine Daten vorhanden sind', async () => {
            mockGetItemsGet.mockResolvedValue({ data: {} })

            const code = computed(() => 'CODE_123')
            const query = withVueQuery(() => useSchoolForm(code))

            const response = await query.refetch()
            expect(response.data).toBeNull()
        })
    })

    describe('useTestData', () => {
        it('sollte Testdaten abrufen', async () => {
            const mockTestResponse = [{ id: 9524, subject: 'Mathematik' }]
            mockGetTestsGet.mockResolvedValue({ data: mockTestResponse })

            const code = computed(() => 'CODE_123')
            const query = withVueQuery(() => useTestData(code))

            const response = await query.refetch()
            expect(response.data).toEqual(mockTestResponse)
            expect(mockGetTestsGet).toHaveBeenCalledWith({
                tgId: 270,
                testIds: '9524',
            })
        })
    })
})
