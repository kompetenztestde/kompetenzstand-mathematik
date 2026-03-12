<script setup>
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
const router = useRouter()
import StackedBarChart from '@/components/StackedBarChart/StackedBarChart.vue'
import { GroupsApi } from '@tba3/api-resources'
import { apiConfiguration } from '@/queries/utils'
import { computed, watch } from 'vue'
const name = 'gross.zitrone.81'
const id = '8b-mathe'
const types = 'students'

const { data: data } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
        const config = await apiConfiguration()
        const api = new GroupsApi(config)
        const response = await api.getGroupItems({ name: name, id: id, type: types })
        const finalItems = response[0]?.items ?? []

        return finalItems
    },
})

const correct = computed(() => {
    if (!data.value) return 0
    const itemsWithOneFrequency = data.value.filter((item) => item.descriptiveStatistics?.frequency === 1)
    return itemsWithOneFrequency.length
})
const failed = computed(() => {
    if (!data.value) return 0
    const itemsWithZeroFrequency = data.value.filter((item) => item.descriptiveStatistics?.frequency === 0)
    return itemsWithZeroFrequency.length
})

const total = computed(() => {
    return data.value?.length || 0
})

const notWorkedOn = computed(() => {
    return total - correct - failed
})
watch(data, (newVal) => {
    if (newVal) {
        console.log('Die Items sind da:', newVal)
        console.log('Anzahl der Items:', total.value)
    }
})
</script>

<template>
    <div class="page">
        <h1>Das ist aufgefallen (Sonderfolie)</h1>
        <div class="container">
            <StackedBarChart
                label="Aufgabenverteilung"
                :correctAnswers="correct"
                :falseAnswers="failed"
                :notWorkedOn="notWorkedOn"
                :total="total"
            />
        </div>
        <div>Text...</div>
    </div>
</template>

<style scoped>
.page {
    padding: 20px;
    text-align: center;
}

.container{
    width: 50%;
    padding: 16px;
    margin: auto;
}
</style>
