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
export function useGuidingIdeasNew(code: ComputedRef<string | undefined>) {
    const { data: items, isLoading } = useUserItemsNew(code)

    const guidingIdeaStats = computed(() => {
        const stats: Record<string, { label: string; text: string; description: string; hits: number; total: number; percentage: number }> =
            {}

        ;(Object.keys(GUIDE_MAP) as GuideKey[]).forEach((key) => {
            stats[key] = {
                label: GUIDE_MAP[key],
                text: guidingIdeaTexts.guiding_ideas_texts[key].text.excellent,
                description: guidingIdeaTexts.guiding_ideas_texts[key].description,
                hits: 0,
                total: 0,
                percentage: 0,
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
        })
        return stats
    })

    // const topPerformers = computed(() => {
    //     return Object.values(guidingIdeaStats.value).filter((s) => s.percentage >= 80)
    // })

    const topPerformers = computed(() => {
        const allGuides = Object.values(guidingIdeaStats.value)
        const qualified = allGuides.filter((s) => s.percentage >= 80 && s.total >= 5)
        return qualified.sort((a, b) => b.percentage - a.percentage)
    })

    const badPerformers = computed(() => {
        if (!items.value || items.value.length === 0) return []
        return Object.values(guidingIdeaStats.value).filter((s) => s.percentage <= 60)
    })

    const extraStepsCount = computed(() => {
        return topPerformers.value.length > 0 ? topPerformers.value.length - 1 : 0
    })

    const calculatedAreas = computed(() => {
        //const rawAreas = guidingIdeaTexts?.areas?.middleCertificate
        const rawAreas = guidingIdeaTexts?.areas?.defaultCertificate

        console.log("JSON Inhalt:", guidingIdeaTexts);
        console.log("Gefundene Areas:", rawAreas); 
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
