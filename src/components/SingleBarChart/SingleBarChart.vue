<script setup lang="ts">
import { computed, defineAsyncComponent, watch } from 'vue'
import '@/assets/styles/base.css'
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'

const VChart = defineAsyncComponent(async () => {
    const [{ use }, { SVGRenderer }, { BarChart }, { GridComponent, MarkLineComponent }, { default: VueECharts }] = await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
        import('echarts/charts'),
        import('echarts/components'),
        import('vue-echarts'),
    ])

    use([SVGRenderer, BarChart, GridComponent, MarkLineComponent])

    return VueECharts
})
const props = defineProps<{
    percentage: number
    label?: string
    areas?: number[]
}>()

const chartOption = computed(() => {    

    let color = ['var(--color-berry)', 'var(--color-berry)']
    return {
        renderer: 'svg',
        animation: false,
        grid: {
            top: 0,
            bottom: 0,
            left: 1,
            right: 0,
            containLabel: false,
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            interval: 50,
            splitLine: { show: false },
            axisLabel: {
                show: false,
                formatter: '{value}%',
                align: 'center',
                margin: 15,
                position: 'top',
                color: 'var(--color-navigation-blue)',
            },
            axisTick: { show: false },
            axisLine: { show: false },
        },
        yAxis: {
            type: 'category',
            data: ['Ergebnis'],
            show: false,
        },
        series: [
            {
                type: 'bar',
                data: [props.percentage],
                barWidth: 20,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            { offset: 0, color: color[0] },
                            { offset: 1, color: color[1] },
                        ],
                    },
                },
            },
        ],
    }
})

watch(
    props,
    (newVal) => {
        console.log('Die Props haben sich geändert:', newVal)
    },
    { deep: true, immediate: true },
)

const a1 = computed(() => props.areas?.[0] ?? 33)
const a2 = computed(() => props.areas?.[1] ?? 66)

const maskArea1 = computed(() => {
    return `linear-gradient(to right, 
        rgba(0, 0, 0, 1) 0%, 
        rgba(0, 0, 0, 1) ${a1.value}%, 
        transparent ${a1.value}%, 
        transparent 100%
    )`
})

const maskArea2 = computed(() => {
    return `linear-gradient(to right, 
        transparent 0%, 
        transparent ${a1.value}%, 
        rgba(0, 0, 0, 1) ${a1.value}%, 
        rgba(0, 0, 0, 1) ${a2.value}%, 
        transparent ${a2.value}%, 
        transparent 100%
    )`
})

const maskArea3 = computed(() => {
    return `linear-gradient(to right, 
        transparent 0%, 
        transparent ${a2.value}%, 
        rgba(0, 0, 0, 1) ${a2.value}%, 
        rgba(0, 0, 0, 1) 100%
    )`
})
</script>


<template>
    <div :class="styles.chartContainer">
        <div :class="styles.chartBackgroundWrapper">
            <div :class="[styles.waveLayer, styles.waveDark]" :style="{ maskImage: maskArea1, WebkitMaskImage: maskArea1 }"></div>
            <div :class="[styles.waveLayer, styles.waveMedium]" :style="{ maskImage: maskArea2, WebkitMaskImage: maskArea2 }"></div>
            <div :class="[styles.waveLayer, styles.waveLight]" :style="{ maskImage: maskArea3, WebkitMaskImage: maskArea3 }"></div>

            <div :class="styles.areaBorder" :style="{ left: (areas?.[0] ?? 33) + '%' }"></div>
            <div :class="styles.areaBorder" :style="{ left: (areas?.[1] ?? 66) + '%' }"></div>
            <VChart :class="styles.chart" :option="chartOption" :init-options="{ renderer: 'svg' }" />
        </div>
    </div>
</template>
