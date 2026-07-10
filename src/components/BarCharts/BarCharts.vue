<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from './styles.module.css'
import '../../assets/styles/variables.css'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/modalStore'
import { defineAsyncComponent } from 'vue'


const VChart = defineAsyncComponent(async () => {
    const [
        { use },
        { SVGRenderer },
        { BarChart },
        { GraphicComponent, GridComponent, TooltipComponent },
        { default: VueECharts }
    ] = await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
        import('echarts/charts'),
        import('echarts/components'),
        import('vue-echarts') 
    ])

    use([SVGRenderer, BarChart, GridComponent, TooltipComponent, GraphicComponent])

    return VueECharts
})

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

<template>
    <div :class="styles.page">
        <div :class="styles.mainLayout" :style="{ '--item-count': badPerformers.length }">
            <div :class="styles.labelsColumn">
                <div v-for="item in badPerformers" :key="item.label" :class="styles.yAxisLabel" @click="openModal(item)">
                    <span :class="styles.labelText">{{ item.label }}</span>
                    <span :class="styles.infoCircle">?</span>
                </div>
            </div>

            <div :class="styles.chartContainer">
                <div :class="styles.chartBackgroundWrapper" :style="{ '--mask': dynamicMask }">
                    <div :class="styles.areaBorder" :style="{ left: areas[0] + '%' }"></div>
                    <div :class="styles.areaBorder" :style="{ left: areas[1] + '%' }"></div>
                </div>

                <VChart :class="styles.chart" :option="chartOption" :init-options="{ renderer: 'svg' }" @click="handleChartClick" autoresize />
                <div :class="styles.scaleLabelsRow">
                    <span
                        :class="styles.scaleLabel"
                        :style="isMobile ? { right: 100 - (props.areas[0] ?? 33) + '%' } : { left: (props.areas[0] ?? 33) / 2 + '%' }"
                    >
                        {{ t('areas.first') }}
                    </span>

                    <span
                        :class="styles.scaleLabel"
                        :style="
                            isMobile
                                ? { right: 100 - ((areas[0] ?? 33) + (areas[1] ?? 66)) + '%' }
                                : { left: ((areas[0] ?? 33) + (areas[1] ?? 66)) / 2 + '%' }
                        "
                    >
                        {{ t('areas.middle') }}
                    </span>

                    <span
                        :class="styles.scaleLabel"
                        :style="
                            isMobile ? { right: (areas[2] ?? 100) - (areas[1] ?? 66) + '%' } : { left: ((areas[1] ?? 66) + 100) / 2 + '%' }
                        "
                    >
                        {{ t('areas.last') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>