<script setup lang>
import { useQuery } from '@tanstack/vue-query'
import { apiConfiguration } from '@/queries/utils'
import { GroupsApi } from '@tba3/api-resources'
import SlideAnimationComponent from '@/components/SlideAnimationComponent/SlideAnimationComponent.vue'
import { computed, watch } from 'vue'

const name = 'gross.zitrone.81'
const id = '8b-mathe'
const types = 'students'

const { data: data } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
        const config = await apiConfiguration()
        const api = new GroupsApi(config)
        const response = await api.getGroupCompetenceLevels({ name: name, id: id, type: types })
        const finalItems = response[0]?.competenceLevels ?? []
        return finalItems
    },
})

const level = computed(() => {
    return data.value[0].name || 0
})

watch(data, (newVal) => {
    if (newVal) {
        console.log('Value:', level.value)
    }
})
</script>

<template>
    <div class="page">
        <h1>Animationsfolie</h1>
        <SlideAnimationComponent :level="level" />
    </div>
</template>

<style scoped>
.page {
    padding: 20px;
    text-align: center;
}
</style>
