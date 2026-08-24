<script setup>
import '@/assets/styles/base.css'
import StackedBarChart from '@/components/StackedBarChart/StackedBarChart.vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserItemsNew } from '@/composables/useUserItems'
import { useI18n } from 'vue-i18n'
import { useSpecialCasesNew } from '@/composables/useSpecialCasesNew'
import styles from './styles.module.css'
const route = useRoute()
const auth = useAuthStore()
const currentUserCode = computed(() => route.query.user || auth.studentCode || undefined)
const { data: data } = useUserItemsNew(currentUserCode)
const { t } = useI18n()
const { specialCaseResult } = useSpecialCasesNew(currentUserCode)

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

// const notWorkedOn = computed(() => {
//     return total - correct - failed
// })

const notWorkedOn = computed(() => {
    if (!data.value) return 0
    const itemsWithMinusFrequency = data.value.filter((item) => item.descriptiveStatistics?.frequency === -1)
    return itemsWithMinusFrequency.length
})

watch(data, (newVal) => {
    if (newVal) {
        console.log('Die Items sind da:', newVal)
        console.log('Anzahl der Items:', total.value)
    }
})
</script>

<template>
    <div :class="styles.page">
        <h1 :class="styles.header">{{ t('specialView.title') }}</h1>
        <div :class="styles.container">
                <StackedBarChart
                    label="Aufgabenverteilung"
                    :correctAnswers="correct"
                    :falseAnswers="failed"
                    :notWorkedOn="notWorkedOn"
                    :total="total"
                />
            <div :class="['text-body-big-bold', styles.resultText]">{{ specialCaseResult.resultAndAdvice.result }}</div>
            <div :class="['text-body-big', styles.adviceText]">{{ specialCaseResult.resultAndAdvice.advice }}</div>
        </div>
    </div>
</template>
