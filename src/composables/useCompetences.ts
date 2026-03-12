import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { GroupsApi } from '@tba3/api-resources'
import { apiConfiguration } from '@/queries/utils'
import { COMPETENCE_MAP, type CompetenceKey } from '@/types'

const activeSubStep = ref(0)

export function useCompetences(id: string, types: string) {
    const { data: data } = useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            const config = await apiConfiguration()
            const api = new GroupsApi(config)
            const response = await api.getGroupItems({ id: id, type: types })
            const finalItems = response[0]?.items ?? []
            return finalItems
        },
    })

    const competenceStats = computed(() => {
        const stats: Record<string, { label: string; hits: number; total: number; percentage: number }> = {}

        ;(Object.keys(COMPETENCE_MAP) as CompetenceKey[]).forEach((key) => {
            stats[key] = {
                label: COMPETENCE_MAP[key],
                hits: 0,
                total: 0,
                percentage: 0,
            }
        })

        if (!data.value) return stats

        data.value.forEach((item) => {
            const competence = item.parameters?.competences?.find((c) => c.type === 'Allgemeine Kompetenz')
            const freq = item.descriptiveStatistics?.frequency
            const key = competence?.name as CompetenceKey

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
    //     if (!competenceStats.value) return []
    //     return Object.values(competenceStats.value).filter((s) => s.percentage > 80)
    // })

    const topPerformers = computed(() => {
        if (!competenceStats.value) return []
        const candidates = Object.values(competenceStats.value).filter((s) => s.percentage > 80)
        return candidates.filter((item, index, self) => index === self.findIndex((t) => t.label === item.label))
    })
    const extraStepsCount = computed(() => {
        return topPerformers.value.length > 0 ? topPerformers.value.length - 1 : 0
    })

    return {
        topPerformers,
        extraStepsCount,
        activeSubStep,
        competenceStats,
    }
}
