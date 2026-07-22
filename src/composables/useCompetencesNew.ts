import { computed, ref, type ComputedRef } from 'vue'
import { COMPETENCE_MAP, type CompetenceKey } from '@/types'
import { useUserItemsNew } from './useUserItems'
import { configJson } from '@/services/configService'

const activeSubStep = ref(0)

interface CompetenceObject {
    description?: string
    name?: string
    nameShort?: string
}

export function useCompetencesNew(code: ComputedRef<string | undefined>) {
    const competenceTexts = configJson
    const { data: data } = useUserItemsNew(code)
    const competenceStats = computed(() => {
        const stats: Record<
            string,
            {
                label: string
                text: string
                hits: number
                total: number
                percentage: number
                description: string

                solutionFreqGymTotal: number
                solutionFreqNonGymTotal: number

                studentSolutionFreqGymTotal: number
                studentSolutionFreqNonGymTotal: number

                finalSolutionFreqGym: number
                finalSolutionFreqNonGym: number
            }
        > = {}

        ;(Object.keys(COMPETENCE_MAP) as CompetenceKey[]).forEach((key) => {
            stats[key] = {
                label: COMPETENCE_MAP[key],
                text: competenceTexts.competence_texts[key].text.excellent,
                description: competenceTexts.competence_texts[key].description.text,
                hits: 0,
                total: 0,
                percentage: 0,

                //solutionFrequency added
                solutionFreqGymTotal: 0,
                solutionFreqNonGymTotal: 0,

                studentSolutionFreqGymTotal: 0,
                studentSolutionFreqNonGymTotal: 0,

                finalSolutionFreqGym: 0,
                finalSolutionFreqNonGym: 0,
            }
        })

        if (!data.value || data.value.length === 0) return stats

        data.value.forEach((item) => {
            const parameters = item.parameters

            const competence = parameters?.generalMathematicalCompetence[0] as CompetenceObject
            const freq = item.descriptiveStatistics?.frequency
            const solutionFreqGym: number = item.parameters?.solutionFrequencyGymnasium ?? 0
            const solutionFreqNonGym: number = item.parameters?.solutionFrequencyNonGymnasium ?? 0

            const key = `K${competence?.nameShort as CompetenceKey}`

            if (key && stats[key]) {
                if (freq === 1 || freq === 0 || freq === -1) {
                    stats[key].total++
                    if (freq === 1) {
                        stats[key].hits++
                        stats[key].studentSolutionFreqGymTotal += solutionFreqGym
                        stats[key].studentSolutionFreqNonGymTotal += solutionFreqNonGym
                    }
                    stats[key].solutionFreqGymTotal += solutionFreqGym
                    stats[key].solutionFreqNonGymTotal += solutionFreqNonGym
                }
            }
        })

        Object.values(stats).forEach((s) => {
            if (s.total > 0) {
                s.percentage = s.total > 0 ? Math.round((s.hits / s.total) * 100) : 0
                s.solutionFreqGymTotal = s.solutionFreqGymTotal / s.total
                s.solutionFreqNonGymTotal = s.solutionFreqNonGymTotal / s.total
                s.studentSolutionFreqGymTotal = s.studentSolutionFreqGymTotal / s.total
                s.studentSolutionFreqNonGymTotal = s.studentSolutionFreqNonGymTotal / s.total
                s.finalSolutionFreqGym = s.studentSolutionFreqGymTotal / s.solutionFreqGymTotal
                s.finalSolutionFreqNonGym = s.studentSolutionFreqNonGymTotal / s.solutionFreqNonGymTotal
            } else {
                s.percentage = 0
                s.finalSolutionFreqGym = 0
                s.finalSolutionFreqNonGym = 0
            }
        })

        return stats
    })

    const topPerformers = computed(() => {
        if (!data.value || data.value.length === 0) return []

        const allStats = Object.values(competenceStats.value)
        const qualifiedStats = allStats.filter((s) => s.total >= 5)

        const filteredBySolutionFreq = qualifiedStats.sort((a, b) => {
            const diff = b.finalSolutionFreqGym - a.finalSolutionFreqGym
            if (Math.abs(diff) > 0.00001) {
                // Schutz vor minimalen Floating-Point-Ungenauigkeiten
                return diff
            }
            return a.finalSolutionFreqGym - b.finalSolutionFreqGym
        })

        const firstPerformer = filteredBySolutionFreq[0]

        if (firstPerformer) {
            return [firstPerformer]
        }
        return []
    })

    const badPerformers = computed(() => {
        if (!competenceStats.value) return []
        const candidates = Object.values(competenceStats.value).filter((s) => s.percentage < 80)
        return candidates.filter((item, index, self) => index === self.findIndex((t) => t.label === item.label))
    })
    const extraStepsCount = computed(() => {
        return topPerformers.value.length > 0 ? topPerformers.value.length - 1 : 0
    })

    return {
        topPerformers,
        badPerformers,
        extraStepsCount,
        activeSubStep,
        competenceStats,
    }
}
