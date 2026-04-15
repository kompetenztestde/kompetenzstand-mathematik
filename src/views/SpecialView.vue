<script setup>
import '@/assets/styles/base.css'
import StackedBarChart from '@/components/StackedBarChart/StackedBarChart.vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserItems } from '@/composables/useUserItems'
import { useI18n } from 'vue-i18n'
import { useSpecialCases } from '@/composables/useSpecialCases'

const route = useRoute()
const currentUserName = computed(() => route.query.user)
const { data: data } = useUserItems(currentUserName)
const { t } = useI18n()
const { specialCaseResult } = useSpecialCases(currentUserName)
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

watch(specialCaseResult, (newVal) => {
    if (newVal) {
        console.log('Die Aggregationen sind da:', newVal)
    }
})
</script>

<template>
    <div class="page">
        <h1>{{ t('specialView.title') }}</h1>
        <div class="container">
            <StackedBarChart
                label="Aufgabenverteilung"
                :correctAnswers="correct"
                :falseAnswers="failed"
                :notWorkedOn="notWorkedOn"
                :total="total"
            />
        </div>
        <div class="text-body-big-bold">{{ specialCaseResult.resultAndAdvice.result }}</div>
        <div class="text-body-big advice">{{ specialCaseResult.resultAndAdvice.advice }}</div>
    </div>
</template>

<style scoped>
.page {
    padding: 20px;
    margin: 20px;
    text-align: left;
    border-radius: 20px;
    background-color: var(--color-white);
    box-shadow: 0 0 20px 0 rgba(34, 92, 115, 0.1);
    overflow-y: auto;
    min-height: calc(100dvh - 10dvh - 40px);
}

.container {
    width: 100%;
    padding: 16px;
    padding-left: 88px;
    padding-right: 87px;
    margin-top: 100px;
}

.advice {
    padding-top: 20px;
}

@media (max-width: 767px) {
    .container {
        padding-left: 0px;
        padding-right: 0px;
    }
}
</style>
