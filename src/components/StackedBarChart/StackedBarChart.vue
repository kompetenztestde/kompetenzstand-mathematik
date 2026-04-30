<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import styles from './styles.module.css'
import '../../assets/styles/variables.css'
import { useI18n } from 'vue-i18n'

use([SVGRenderer, BarChart, GridComponent])

const { t } = useI18n()

const props = defineProps<{
    correctAnswers: number
    falseAnswers: number
    notWorkedOn: number
    total: number
    label?: string
}>()

const isOverLimit = computed(() => props.correctAnswers + props.falseAnswers + props.notWorkedOn > props.total)

const chartOption = computed(() => {
    const bWidth = 50
    return {
        grid: { top: 0, bottom: 0, left: 0, right: 0 },
        xAxis: { type: 'value', max: props.total, show: false },
        yAxis: { type: 'category', data: ['Result'], show: false },
        series: [
            {
                type: 'bar',
                stack: 'total',
                name: 'Richtig',
                barWidth: bWidth,
                data: [props.correctAnswers],
                label: { show: false },
                itemStyle: { color: 'var(--color-berry)', borderColor: 'var(--color-white)', borderWidth: 1},
                emphasis: { disabled: true },
            },
            {
                type: 'bar',
                stack: 'total',
                name: 'Falsch',
                barWidth: bWidth,
                data: [props.falseAnswers],
                label: { show: false },
                itemStyle: { color: 'var(--color-pink)', borderColor: 'var(--color-white)', borderWidth: 1},
                emphasis: { disabled: true },
            },
            {
                type: 'bar',
                stack: 'total',
                name: 'Offen',
                barWidth: bWidth,
                data: [props.notWorkedOn],
                label: { show: false },
                itemStyle: { color: 'var(--color-turquise)', borderColor: 'var(--color-white)', borderWidth: 1},
                emphasis: { disabled: true },
            },
        ],
    }
})
</script>

<template>
    <div :class="styles.chartWrapper">
        <div :class="styles.floatingLabels">
            <div v-if="correctAnswers > 0" :class="[styles.fLabel, 'text-body']" :style="{ width: (correctAnswers / total) * 100 + '%' }">
                <span>{{ t('specialView.correct') }}</span>
            </div>
            <div v-if="falseAnswers > 0" :class="[styles.fLabel, 'text-body']" :style="{ width: (falseAnswers / total) * 100 + '%' }">
                <span>{{ t('specialView.false') }}</span>
            </div>
            <div v-if="notWorkedOn > 0" :class="[styles.fLabel, 'text-body']" :style="{ width: (notWorkedOn / total) * 100 + '%' }">
                <span>{{ t('specialView.notWorkedOn') }}</span>
            </div>
        </div>

        <div :class="styles.chartContainer">
            <VChart :option="chartOption" autoresize :init-options="{ renderer: 'svg' }" />
        </div>
        <div :class="styles.bottomValues">
            <div v-if="correctAnswers > 0" :class="[styles.vLabel, 'text-label']" :style="{ width: (correctAnswers / total) * 100 + '%' }">
                {{ ((correctAnswers / total) * 100).toFixed(0) }}%
            </div>
            <div v-if="falseAnswers > 0" :class="[styles.vLabel, 'text-label']" :style="{ width: (falseAnswers / total) * 100 + '%' }">
                {{ ((falseAnswers / total) * 100).toFixed(0) }}%
            </div>
            <div v-if="notWorkedOn > 0" :class="[styles.vLabel, 'text-label']" :style="{ width: (notWorkedOn / total) * 100 + '%' }">
                {{ ((notWorkedOn / total) * 100).toFixed(0) }}%
            </div>
        </div>

        <span v-if="isOverLimit" :class="styles.error">{{ t('specialView.warning') }}</span>
    </div>
</template>
