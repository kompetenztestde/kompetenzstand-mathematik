import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { useGuidingIdeasNew } from '@/composables/useGuidingIdeasNew'
import { IconStatus } from '@/types'

const mockItems = ref<any[]>([])
const mockSchoolForm = ref<string | null>(null)
const mockTestData = ref<any[] | null>(null)
const mockIsLoading = ref(false)

vi.mock('@/composables/useUserItems', () => ({
    useUserItemsNew: () => ({
        data: mockItems,
        isLoading: mockIsLoading,
    }),
    useSchoolForm: () => ({
        data: mockSchoolForm,
    }),
    useTestData: () => ({
        data: mockTestData,
    }),
}))

vi.mock('@/services/configService', () => ({
    configJson: {
        testInfo: {
            subject: ['Mathematik'],
            booklet: {
                gym: ['GYM_BOOKLET'],
                nonGym: ['NONGYM_BOOKLET'],
            },
        },
        areas: {
            middleCertificate: [
                [0, 30],
                [31, 60],
                [61, 100],
            ],
            defaultCertificate: [
                [0, 40],
                [41, 70],
                [71, 100],
            ],
        },
        guiding_ideas_texts: {
            L1: {
                text: { excellent: 'L1 Ex', good: 'L1 Gut', normal: 'L1 Normal', bad: 'L1 Schlecht' },
                description: 'L1 Desc',
                cutOffs: {
                    gym: { lower: [1, 2], middle: [3, 4], upper: [5, 6] },
                    nonGym: { lower: [1], middle: [2, 3], upper: [4, 5] },
                },
            },
            L2: {
                text: { excellent: 'L2 Ex', good: 'L2 Gut', normal: 'L2 Normal', bad: 'L2 Schlecht' },
                description: 'L2 Desc',
                cutOffs: {
                    gym: { lower: [1, 2], middle: [3, 4], upper: [5, 6] },
                    nonGym: { lower: [1], middle: [2, 3], upper: [4, 5] },
                },
            },
            L3: {
                text: { excellent: 'L3 Ex', good: 'L3 Gut', normal: 'L3 Normal', bad: 'L3 Schlecht' },
                description: 'L3 Desc',
                cutOffs: {
                    gym: { lower: [1, 2], middle: [3, 4], upper: [5, 6] },
                    nonGym: { lower: [1], middle: [2, 3], upper: [4, 5] },
                },
            },
            L4: {
                text: { excellent: 'L4 Ex', good: 'L4 Gut', normal: 'L4 Normal', bad: 'L4 Schlecht' },
                description: 'L4 Desc',
                cutOffs: {
                    gym: { lower: [1, 2], middle: [3, 4], upper: [5, 6] },
                    nonGym: { lower: [1], middle: [2, 3], upper: [4, 5] },
                },
            },
            L5: {
                text: { excellent: 'L5 Ex', good: 'L5 Gut', normal: 'L5 Normal', bad: 'L5 Schlecht' },
                description: 'L5 Desc',
                cutOffs: {
                    gym: { lower: [1, 2], middle: [3, 4], upper: [5, 6] },
                    nonGym: { lower: [1], middle: [2, 3], upper: [4, 5] },
                },
            },
        },
    },
}))

describe('useGuidingIdeasNew', () => {
    beforeEach(() => {
        mockItems.value = []
        mockSchoolForm.value = null
        mockTestData.value = null
        mockIsLoading.value = false
    })

    it('sollte leere Initialwerte zurückgeben', () => {
        const userCode = computed(() => 'TEST_CODE')
        const { guidingIdeaStats, topPerformers, badPerformers } = useGuidingIdeasNew(userCode)

        expect(guidingIdeaStats.value['L1']?.hits).toBe(0)
        expect(guidingIdeaStats.value['L1']?.total).toBe(0)
        expect(topPerformers.value).toEqual([])
        expect(badPerformers.value).toEqual([])
    })

    it('sollte Gymnasium-Modus über das Booklet korrekt erkennen', () => {
        mockTestData.value = [{ subject: 'Mathematik', booklet: 'GYM_BOOKLET' }]
        const userCode = computed(() => 'TEST_CODE')
        const { calculatedAreas } = useGuidingIdeasNew(userCode)

        expect(calculatedAreas.value).toEqual([30, 60, 100])
    })

    it('sollte Treffer berechnen und das Icon auf Negative setzen bei niedriger Trefferquote', () => {
        mockSchoolForm.value = 'Gymnasium'
        mockItems.value = [
            {
                parameters: { coreIdea: { nameShort: '1' } },
                descriptiveStatistics: { frequency: -1 },
            },
            {
                parameters: { coreIdea: { nameShort: '1' } },
                descriptiveStatistics: { frequency: 0 },
            },
        ]

        const userCode = computed(() => 'TEST_CODE')
        const { guidingIdeaStats } = useGuidingIdeasNew(userCode)

        const l1 = guidingIdeaStats.value['L1']
        expect(l1?.total).toBe(2)
        expect(l1?.hits).toBe(0)
        expect(l1?.percentage).toBe(0)
        expect(l1?.type).toBe(IconStatus.Negative)
    })

    it('sollte badPerformers identifizieren wenn Treffer <= lowerThreshold', () => {
        mockSchoolForm.value = 'Gymnasium'
        mockItems.value = [
            {
                parameters: { coreIdea: { nameShort: '1' } },
                descriptiveStatistics: { frequency: 1 },
            },
            {
                parameters: { coreIdea: { nameShort: '1' } },
                descriptiveStatistics: { frequency: 0 },
            },
        ]

        const userCode = computed(() => 'TEST_CODE')
        const { badPerformers } = useGuidingIdeasNew(userCode)

        expect(badPerformers.value.length).toBeGreaterThan(0)
        expect(badPerformers.value[0]?.label).toBe('Zahl und Operation')
    })
})

function guidingIdeaStats_label_check(key: string) {
    return key
}
