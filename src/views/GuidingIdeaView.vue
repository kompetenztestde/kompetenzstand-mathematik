<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { GroupsApi } from '@tba3/api-resources'
import { apiConfiguration } from '@/queries/utils'
import { computed, watch } from 'vue'
import { GUIDE_MAP, type GuideKey } from '@/types'
import GuidingIdeaComponent from '@/components/GuidingIdeaComponent/GuidingIdeaComponent.vue'
const id = '8b-mathe'
const types = 'students'

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

const guidingIdeaStats = computed(() => {
    const stats: Record<string, { label: string; hits: number; total: number; percentage: number }> = {}

    ;(Object.keys(GUIDE_MAP) as GuideKey[]).forEach((key) => {
        stats[key] = {
            label: GUIDE_MAP[key],
            hits: 0,
            total: 0,
            percentage: 0,
        }
    })

    if (!data.value) return stats

    data.value.forEach((item) => {
        const guide = item.parameters?.competences?.find((c) => c.type === 'Leitidee')
        const freq = item.descriptiveStatistics?.frequency
        const key = guide?.name as GuideKey

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

const total = computed(() => {
    return data.value?.length || 0
})

const topPerformers = computed(() => {
  return Object.values(guidingIdeaStats.value).filter(stat => stat.percentage > 80);
});

</script>

<template>
    <div class="page">
        <h1>Leitideen</h1>
        <div class="container"></div>
        <div>In den folgenden Leitideen hast du sehr gute Ergebnisse geliefert</div>
        <GuidingIdeaComponent />
    </div>
</template>

<style scoped>
.page {
    padding: 20px;
    text-align: center;
}

.container {
    width: 50%;
    padding: 16px;
    margin: auto;
}
</style>
