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

const chartOption = computed(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    

    const area1End = props.areas[0] ?? 33
    const area2End = props.areas[1] ?? 66

    const splitAreaColors = Array.from({ length: 100 }, (_, i) => {
        if (i < area1End) return { image: darkWavesIcon, repeat: 'repeat' }
        if (i < area2End) return { image: wavesIcon, repeat: 'repeat' }
        return { image: lightWavesIcon, repeat: 'repeat' }
    })

    return {
        renderer: 'svg',
        grid: {
            left: isMobile ? '0%' : '5%',
            right: '10%',
            bottom: isMobile ? '20%' : '15%',
            top: '5%',
            containLabel: true,
        },

        xAxis: {
            type: 'value',
            max: 100,
            // interval: 33.33,
            interval: 1,
            // splitLine: { lineStyle: { color: 'rgba(0,0,0,0.05)' } },
            splitLine: {show:false},
            axisLabel: {
                hideOverlap: false,
                margin: 12,
                rotate: isMobile ? 45 : 0,
                formatter: (value: number) => {
                    if (value === 0) return t('areas.first')
                    if (value === 50) return t('areas.middle')
                    if (value === 100) return t('areas.last')
                    return ''
                },
                color: 'var(--color-navigation-blue)',
                fontSize: 16,
            },
            // splitArea: {
            //     show: true,
            //     areaStyle: {
            //         // color: {
            //         //     image: wavesIcon,
            //         //     repeat: 'repeat',
            //         // },
            //         color: [
            //             {
            //                 image: darkWavesIcon,
            //                 repeat: 'repeat',
            //             },
            //             {
            //                 image: wavesIcon,
            //                 repeat: 'repeat',
            //             },
            //             {
            //                 image: lightWavesIcon,
            //                 repeat: 'repeat',
            //             },
            //         ],
            //         //opacity: 0.3,
            //     },
            // },
            splitArea: {
                show: true,
                areaStyle: {
                    color: splitAreaColors
                },
            },
        },
        yAxis: {
            type: 'category',
            triggerEvent: true,
            data: props.badPerformers.map((item) => item.label),
            axisLabel: {
                formatter: (value: string) => `${value} {infoIcon|?}  `,
                rich: {
                    infoIcon: {
                        color: 'var(--color-navigation-blue)',
                        backgroundColor: 'var(--color-white)',
                        borderRadius: 10,
                        width: 16,
                        height: 16,
                        align: 'center',
                        shadowColor: 'rgba(0, 32, 137, 0.25)',
                        padding: [1, 1, 1, 1],
                        shadowBlur: 6,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    },
                },
                color: 'var(--color-navigation-blue)',
                fontSize: 18,
            },
        },
        series: [
            {
                type: 'bar',
                data: props.badPerformers.map((item) => ({
                    value: item.percentage,
                    itemStyle: {
                        color: 'var(--color-berry)',
                    },
                })),
                barWidth: 40,
                showBackground: true,
                // backgroundStyle: {
                //     color: 'rgba(0, 0, 0, 0.05)',
                // },
            },
        ],
    }
})

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
</script>
<template>
    <div :class="styles.page">
        <div class="chart-wrapper">
            <VChart class="chart" :option="chartOption" :init-options="{ renderer: 'svg' }" @click="handleChartClick" autoresize />
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
