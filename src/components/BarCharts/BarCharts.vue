<script setup lang="ts">
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import VChart from 'vue-echarts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import styles from './styles.module.css'

use([SVGRenderer, BarChart, GridComponent, TooltipComponent])
interface Performer {
    label: string
    text: string
    description: string
    hits: number
    total: number
    percentage: number
}
const props = defineProps<{
    badPerformers: Performer[]
}>()

const chartOption = computed(() => {
    return {
        renderer: 'svg',
        grid: {
            left: '3%',
            right: '10%',
            bottom: '15%',
            top: '5%',
            containLabel: true,
        },
        xAxis: {
            type: 'value',
            max: 100,
            interval: 50,
            splitLine: { lineStyle: { color: 'rgba(0,0,0,0.05)' } },
            axisLabel: {
                hideOverlap: false,
                formatter: (value: number) => {
                    if (value === 0) return 'Unterer Bereich'
                    if (value === 50) return 'Erwartungsbereich'
                    if (value === 100) return 'Optimalbereich'
                    return ''
                },
                color: '#aaa',
                fontSize: 11,
            },
        },
        yAxis: {
            type: 'category',
            triggerEvent: true,
            data: props.badPerformers.map((item) => item.label),
            axisLabel: {
                formatter: (value: string) => `{infoIcon|i}  ${value}`,
                rich: {
                    infoIcon: {
                        color: '#fff',
                        backgroundColor: '#42b883',
                        borderRadius: 10,
                        width: 16,
                        height: 16,
                        align: 'center',
                        fontWeight: 'bold',
                        fontSize: 10,
                    },
                },
            },
        },
        series: [
            {
                type: 'bar',
                data: props.badPerformers.map((item) => ({
                    value: item.percentage,
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                        color: getEChartsGradient(item.percentage),
                    },
                })),
                barWidth: 20,
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 4,
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%',
                    color: '#666',
                    fontSize: 12,
                },
            },
        ],
    }
})

function getEChartsGradient(pct: number) {
    let colors = ['#ff8787', '#ff6b6b']
    if (pct >= 33 && pct < 66) colors = ['#ffd43b', '#fcc419']
    if (pct >= 66) colors = ['#63e6be', '#42b883']

    return {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
            { offset: 0, color: colors[0] },
            { offset: 1, color: colors[1] },
        ],
    }
}

const handleChartClick = (params: any) => {
    let index = -1

    if (params.componentType === 'series') {
        index = params.dataIndex
    } else if (params.componentType === 'yAxis') {
        index = props.badPerformers.findIndex((p) => p.label === params.value)
    }

    if (index !== -1) {
        const performer = props.badPerformers[index]
        if (performer) {
            activeDescription.value = performer.description
        }
    }
}

const activeDescription = ref<string | null>(null)
const showInfo = (desc: string | undefined) => {
    activeDescription.value = desc || 'Keine Beschreibung verfügbar.'
}

const closeInfo = () => {
    activeDescription.value = null
}
const getBarClass = (percentage: number) => {
    if (percentage < 33) return styles.barLow
    if (percentage < 66) return styles.barMid
    return styles.barHigh
}
</script>
<!-- <template>
    <div :class="styles.page">
        <div :class="styles.chartContainer">
            <div v-for="item in badPerformers" :key="item.label" :class="styles.chartRow">
                <div :class="styles.labelArea">
                    <button @click="showInfo(item.description)" :class="styles.infoBtn" title="Mehr Informationen">i</button>
                    <span :class="styles.labelText">{{ item.label }}</span>
                </div>

                <div :class="styles.barTrack">
                    <div :class="[styles.bar, getBarClass(item.percentage)]" :style="{ width: `${item.percentage}%` }">
                        <span :class="styles.valueBadge">{{ item.percentage }}%</span>
                    </div>
                </div>
            </div>

            <div :class="styles.xAxisLabels">
                <div :class="styles.axisSpace"></div>
                <div :class="styles.axisTicks">
                    <span>Unterer Bereich</span>
                    <span>Erwartungsbereich</span>
                    <span>Optimalbereich</span>
                </div>
            </div>
        </div>

        <div v-if="activeDescription" :class="styles.modalOverlay" @click="closeInfo">
            <div :class="styles.modalContent" @click.stop>
                <h3>Details</h3>
                <p>{{ activeDescription }}</p>
                <button @click="closeInfo" :class="styles.closeBtn">Schließen</button>
            </div>
        </div>
    </div>
</template> -->

<template>
    <div :class="styles.page">
        <div class="chart-wrapper">
            <VChart class="chart" :option="chartOption" :init-options="{ renderer: 'svg' }" @click="handleChartClick" autoresize />
        </div>

        <div v-if="activeDescription" :class="styles.modalOverlay" @click="closeInfo">
            <div :class="styles.modalContent" @click.stop>
                <h3>Details</h3>
                <p>{{ activeDescription }}</p>
                <button @click="closeInfo" :class="styles.closeBtn">Schließen</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chart-wrapper {
    width: 100%;
    height: 400px;
}
.chart {
    width: 100%;
    height: 100%;
}
</style>
