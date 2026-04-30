<script setup lang="ts">
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import VChart from 'vue-echarts'
import { GraphicComponent, GridComponent, TooltipComponent } from 'echarts/components'
import styles from './styles.module.css'
import '../../assets/styles/variables.css'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/modalStore'
import darkWavesIcon from '@/themes/icons/dark_waves.svg'
import wavesIcon from '@/themes/icons/waves.svg'
import lightWavesIcon from '@/themes/icons/light_waves.svg'

import { watch } from 'vue'

use([SVGRenderer, BarChart, GridComponent, TooltipComponent, GraphicComponent])
interface Performer {
    label: string
    text: string
    description: string
    hits: number
    total: number
    percentage: number
}

const { t } = useI18n()
const modalStore = useModalStore()

const props = defineProps<{
    badPerformers: Performer[]
    areas: number[]
}>()

const isMobile = ref(false)

const dynamicMask = computed(() => {
    const a1 = props.areas?.[0] ?? 33
    const a2 = props.areas?.[1] ?? 66

    return `linear-gradient(to right, 
        rgba(0, 0, 0, 1) 0%, 
        rgba(0, 0, 0, 1) ${a1}%, 
        rgba(0, 0, 0, 0.7) ${a1}%, 
        rgba(0, 0, 0, 0.7) ${a2}%, 
        rgba(0, 0, 0, 0.3) ${a2}%, 
        rgba(0, 0, 0, 0.3) 100%
    )`
})

// const chartOption = computed(() => {
//     const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

//     const area1End = props.areas[0] ?? 33
//     const area2End = props.areas[1] ?? 66

//     const splitAreaColors = Array.from({ length: 100 }, (_, i) => {
//         if (i < area1End) return { image: darkWavesIcon, repeat: 'repeat' }
//         if (i < area2End) return { image: wavesIcon, repeat: 'repeat' }
//         return { image: lightWavesIcon, repeat: 'repeat' }
//     })

//     return {
//         renderer: 'svg',
//         grid: {
//             left: isMobile ? '0%' : '5%',
//             right: '10%',
//             bottom: isMobile ? '20%' : '15%',
//             top: '5%',
//             containLabel: true,
//         },

//         xAxis: {
//             type: 'value',
//             max: 100,
//             interval: 1,
//             splitLine: { show: false },
//             axisTick: { show: false },
//             axisLine: { show: false },
//             axisLabel: {
//                 hideOverlap: false,
//                 margin: 12,
//                 rotate: isMobile ? 45 : 0,
//                 formatter: (value: number) => {
//                     if (value === 0) return t('areas.first')
//                     if (value === 50) return t('areas.middle')
//                     if (value === 100) return t('areas.last')
//                     return ''
//                 },
//                 color: 'var(--color-navigation-blue)',
//                 fontSize: 16,
//             },
//             // splitArea: {
//             //     show: true,
//             //     areaStyle: {
//             //         // color: {
//             //         //     image: wavesIcon,
//             //         //     repeat: 'repeat',
//             //         // },
//             //         color: [
//             //             {
//             //                 image: darkWavesIcon,
//             //                 repeat: 'repeat',
//             //             },
//             //             {
//             //                 image: wavesIcon,
//             //                 repeat: 'repeat',
//             //             },
//             //             {
//             //                 image: lightWavesIcon,
//             //                 repeat: 'repeat',
//             //             },
//             //         ],
//             //         //opacity: 0.3,
//             //     },
//             // },
//             // splitArea: {
//             //     show: true,
//             //     areaStyle: {
//             //         color: splitAreaColors,
//             //     },
//             // },
//             splitArea: {show:false}
//         },
//         yAxis: {
//             type: 'category',
//             triggerEvent: true,
//             data: props.badPerformers.map((item) => item.label),
//             splitLine: { show: false },
//             axisTick: { show: false },
//             axisLine: { show: false },
//             axisLabel: {
//                 formatter: (value: string) => `${value} {infoIcon|?}  `,
//                 rich: {
//                     infoIcon: {
//                         color: 'var(--color-navigation-blue)',
//                         backgroundColor: 'var(--color-white)',
//                         borderRadius: 10,
//                         width: 16,
//                         height: 16,
//                         align: 'center',
//                         shadowColor: 'rgba(0, 32, 137, 0.25)',
//                         padding: [1, 1, 1, 1],
//                         shadowBlur: 6,
//                         shadowOffsetX: 0,
//                         shadowOffsetY: 0,
//                     },
//                 },
//                 color: 'var(--color-navigation-blue)',
//                 fontSize: 18,
//             },
//         },
//         series: [
//             {
//                 type: 'bar',
//                 data: props.badPerformers.map((item) => ({
//                     value: item.percentage,
//                     itemStyle: {
//                         color: 'var(--color-berry)',
//                     },
//                 })),
//                 barWidth: 40,
//                 // showBackground: true,
//             },
//         ],
//     }
// })

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
            modalStore.openModal(performer.label, performer.description || performer.text)
        }
    }
}

const chartOption = computed(() => {
    return {
        renderer: 'svg',
        backgroundColor: 'transparent',
        grid: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 40,
            containLabel: false,
        },
        xAxis: {
            type: 'value',
            max: 100,
            boundaryGap: false,
            // axisLabel: {
            //     show: true,
            //     margin: 15,
            //     formatter: (value: number) => {
            //         if (value === 0) return t('areas.first')
            //         if (value === 50) return t('areas.middle')
            //         if (value === 100) return t('areas.last')
            //         return ''
            //     },
            //     color: 'var(--color-navigation-blue)',
            // },
            axisLabel: { show: false },
            splitLine: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'category',
            show: false,
            data: props.badPerformers.map((p) => p.label),
            inverse: true,
        },
        series: [
            {
                type: 'bar',
                data: props.badPerformers.map((item) => item.percentage),
                barWidth: 40,
                itemStyle: { color: 'var(--color-berry)' },
            },
        ],
    }
})

const openModal = (item: any) => {
    modalStore.openModal(item.label, item.description || item.text)
}
</script>
<!-- <template>
    <div :class="styles.page">
        <div class="chart-wrapper">
            <VChart class="chart" :option="chartOption" :init-options="{ renderer: 'svg' }" @click="handleChartClick" autoresize />
        </div>
    </div>
</template> -->

<template>
    <div :class="styles.page">
        <div class="main-layout">
            <!-- <div class="labels-column">
                <div v-for="item in badPerformers" :key="item.label" class="y-axis-label" @click="openModal(item)">
                    {{ item.label }} <span class="info-circle">?</span>
                </div>
            </div> -->
            <div class="labels-column">
                <div v-for="item in badPerformers" :key="item.label" class="y-axis-label" @click="openModal(item)">
                    <span class="label-text">{{ item.label }}</span>
                    <span class="info-circle">?</span>
                </div>
            </div>

            <div class="chart-container">
                <div class="chart-background-wrapper" :style="{ '--mask': dynamicMask }">
                    <div class="area-border" :style="{ left: areas[0] + '%' }"></div>
                    <div class="area-border" :style="{ left: areas[1] + '%' }"></div>
                </div>

                <VChart class="chart" :option="chartOption" :init-options="{ renderer: 'svg' }" @click="handleChartClick" autoresize />
                <div class="scaleLabelsRow">
                    <span
                        class="scaleLabel"
                        :style="isMobile ? { right: 100 - (props.areas[0] ?? 33) + '%' } : { left: (props.areas[0] ?? 33) / 2 + '%' }"
                    >
                        {{ t('areas.first') }}
                    </span>

                    <span
                        class="scaleLabel"
                        :style="
                            isMobile
                                ? { right: 100 - ((areas[0] ?? 33) + (areas[1] ?? 66)) + '%' }
                                : { left: ((areas[0] ?? 33) + (areas[1] ?? 66)) / 2 + '%' }
                        "
                    >
                        {{ t('areas.middle') }}
                    </span>

                    <span
                        class="scaleLabel"
                        :style="
                            isMobile
                                ? { right: ((areas[2] ?? 100) - (areas[1] ?? 66))  + '%' }
                                : { left: ((areas[1] ?? 66) + 100) / 2 + '%' }
                        "
                    >
                        {{ t('areas.last') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* .chart-wrapper {
    width: 100%;
    height: 400px;
}
.chart {
    width: 100%;
    height: 100%;
} */

.main-layout {
    display: flex;
    width: 100%;
    /* align-items: flex-start; */
}

.labels-column {
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    margin-right: 20px;
    max-width: 238px;
    align-items: flex-start;
}

.y-axis-label {
    height: 70px;
    display: flex;
    /* align-items: center;
    justify-content: flex-end; */
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    color: var(--color-navigation-blue);
    cursor: pointer;
    /* white-space: nowrap; */
}

.info-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    min-width: 18px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 8px;
    margin-top: 1px;
    flex-shrink: 0;
}

.label-text {
    color: var(--color-navigation-blue);
    text-align: left;
    flex: 1;
    word-break: break-word;
}

.chart-container {
    position: relative;
    flex-grow: 1;
    height: 400px;
}

.chart-background-wrapper {
    position: absolute;
    top: 20px;
    bottom: 40px;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.02);
    z-index: 0;
}

.chart-background-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('@/themes/icons/waves.svg');
    background-repeat: repeat-x;
    background-position: bottom;
    background-size: cover;
    -webkit-mask-image: var(--mask);
    mask-image: var(--mask);
}

.chart {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
}

.area-border {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: white;
    z-index: 1;
}

.scaleLabelsRow {
    position: relative;
    height: 30px;
    margin-top: 8px;
    width: 100%;
}

.scaleLabel {
    position: absolute;
    transform: translateX(-50%);
    white-space: nowrap;
    color: var(--color-navigation-blue);
    text-align: center;
}

@media (max-width: 1000px) {
    .scaleLabel {
        font-size: 12px;
        line-height: 18px;
        transform: rotate(-45deg);
    }
}
</style>
