import { computed, ref, type ComputedRef } from 'vue'
import { GUIDE_MAP, type GuideKey } from '@/types'
import guidingIdeaTexts from '../assets/competence_guidingideas_texts.json'
import { useUserItemsNew } from './useUserItems'

const activeSubStep = ref(0)
// interface CompetenceObject {
//     type?: string;
//     name?: string;
// }

interface CoreIdeaObject {
    description?: string
    name?: string
    nameShort?: string
}

interface CutOffLevels {
    lower: number[]
    middle: number[]
    upper: number[]
}

interface CutOffs {
    gym: CutOffLevels
    nonGym: CutOffLevels
}

export function useGuidingIdeasNew(code: ComputedRef<string | undefined>) {
    const { data: items, isLoading } = useUserItemsNew(code)

    const guidingIdeaStats = computed(() => {
        const stats: Record<
            string,
            {
                label: string
                text: string
                description: string
                hits: number
                total: number
                percentage: number
                cutOffs: CutOffs
                areas: number[]
            }
        > = {}

        ;(Object.keys(GUIDE_MAP) as GuideKey[]).forEach((key) => {
            stats[key] = {
                label: GUIDE_MAP[key],
                text: guidingIdeaTexts.guiding_ideas_texts[key].text.excellent,
                description: guidingIdeaTexts.guiding_ideas_texts[key].description,
                hits: 0,
                total: 0,
                percentage: 0,
                cutOffs: guidingIdeaTexts.guiding_ideas_texts[key].cutOffs,
                areas: [33, 66, 100],
            }
        })

        if (!items.value || items.value.length === 0) return stats

        items.value.forEach((item) => {
            // const competences = (item.parameters?.competences as CompetenceObject[]) || []
            const parameters = item.parameters
            const guide = parameters?.coreIdea as CoreIdeaObject

            const freq = item.descriptiveStatistics?.frequency
            const key = `L${guide.nameShort as GuideKey}`

            if (key && stats[key]) {
                if (freq === 1 || freq === 0 || freq === -1) {
                    stats[key].total++
                    if (freq === 1) stats[key].hits++
                }
            }
        })

        Object.values(stats).forEach((s) => {
            s.percentage = s.total > 0 ? Math.round((s.hits / s.total) * 100) : 0
            if (s.total > 0 && s.cutOffs?.gym) {
                const gym = s.cutOffs.gym

                const reference = s.total > 0 ? s.total : 1

                const lowerMax = gym.lower?.[gym.lower.length - 1] ?? Math.round(reference * 0.33)
                const middleMax = gym.middle?.[gym.middle.length - 1] ?? Math.round(reference * 0.66)
                const upperMax = gym.upper?.[gym.upper.length - 1] ?? reference

                s.areas = [
                    Math.round((lowerMax / reference) * 100),
                    Math.round((middleMax / reference) * 100),
                    Math.round((upperMax / reference) * 100),
                ]
                // if (s.total > 0 && s.cutOffs?.gym) {
                //     const gym = s.cutOffs.gym
                //     const reference = s.total

                //     const lowerThreshold = gym.lower[gym.lower.length - 1] ?? 0
                //     const middleThreshold = gym.middle[gym.middle.length - 1] ?? 0

                //     s.areas = [Math.round(((lowerThreshold + 1) / reference) * 100), Math.round(((middleThreshold + 1) / reference) * 100), 100]
                //     s.areas = s.areas.map((val) => Math.min(val, 100))
            } else {
                s.areas = [33, 66, 100]
            }
        })
        console.log('STATS', stats)
        return stats
    })

    // const topPerformers = computed(() => {
    //     return Object.values(guidingIdeaStats.value).filter((s) => s.percentage >= 80)
    // })

    const topPerformers = computed(() => {
        const allGuides = Object.values(guidingIdeaStats.value)
        // const qualified = allGuides.filter((s) => s.percentage >= 80 && s.total >= 5)
        const qualified = allGuides.filter((s) => {
            if (s.total < 5) return false

            // const upperThreshold = s.cutOffs?.gym?.upper?.[0] ?? Infinity
            const upperThreshold = s.cutOffs?.gym?.middle?.[0] ?? Infinity

            return s.hits >= upperThreshold
        })
        return qualified.sort((a, b) => b.percentage - a.percentage)
    })

    const badPerformers = computed(() => {
        if (!items.value || items.value.length === 0) return []
        // return Object.values(guidingIdeaStats.value).filter((s) => s.percentage <= 60)
        return Object.values(guidingIdeaStats.value).filter((s) => {
            // const lowerThreshold = s.cutOffs?.gym?.middle?.[s.cutOffs.gym.middle.length - 1] ?? -1
            const lowerThreshold = s.cutOffs?.gym?.lower?.[s.cutOffs.gym.lower.length - 1] ?? -1
            return s.hits <= lowerThreshold && s.total > 0
        })
    })

    const extraStepsCount = computed(() => {
        return topPerformers.value.length > 0 ? topPerformers.value.length - 1 : 0
    })

    const calculatedAreas = computed(() => {
        //const rawAreas = guidingIdeaTexts?.areas?.middleCertificate
        const rawAreas = guidingIdeaTexts?.areas?.defaultCertificate
        if (!Array.isArray(rawAreas) || rawAreas.length === 0) {
            return [33, 66, 100]
        }

        const lastElement = rawAreas[rawAreas.length - 1]
        const maxVal = (lastElement && lastElement[1]) ?? 100

        return rawAreas.map((range) => {
            const val = range[1] ?? 0
            return maxVal > 0 ? Math.round((val / maxVal) * 100) : 0
        })
    })

    return {
        topPerformers,
        badPerformers,
        extraStepsCount,
        activeSubStep,
        guidingIdeaStats,
        calculatedAreas,
        isLoading,
    }
}
