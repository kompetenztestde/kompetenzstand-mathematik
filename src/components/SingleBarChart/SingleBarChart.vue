<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, MarkLineComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import '@/assets/styles/base.css'
import { useI18n } from 'vue-i18n'

use([SVGRenderer, BarChart, GridComponent, MarkLineComponent])

const { t } = useI18n()
const props = defineProps<{
    percentage: number
    label?: string
}>()

const chartOption = computed(() => {
    // let color = ['#ff8787', '#ff6b6b'];
    // if (props.percentage >= 33 && props.percentage < 66) color = ['#ffd43b', '#fcc419'];
    // if (props.percentage >= 66) color = ['#63e6be', '#42b883'];

    let color = ['var(--color-pink)', 'var(--color-berry)']
    return {
        renderer: 'svg',
        grid: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            containLabel: false,
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            interval: 50,
            splitLine: {
                show: true,
                lineStyle: { color: 'rgba(0,0,0,0.05)' },
            },
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
                barWidth: 28,
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
                label: {
                    show: true,
                    position: 'insideRight',
                    formatter: '{c}%',
                    color: '#fff',
                    fontWeight: 'bold',
                    distance: 10,
                },
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 6,
                },
            },
        ],
    }
})
</script>

<template>
    <div class="chart-container">
        <h1>{{ t('common.result') }}</h1>
        <div class="chart-background-wrapper">
            <VChart class="chart" :option="chartOption" :init-options="{ renderer: 'svg' }" />
        </div>
    </div>
</template>

<style scoped>
.chart-container {
    width: 100%;
}

.chart-background-wrapper {
    position: relative;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.02);
    overflow: hidden;
}

.chart-background-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;

    background-image: url('@/themes/icons/waves.svg');
    background-repeat: repeat-x;
    background-position: bottom;
    background-size: cover;

    -webkit-mask-image: linear-gradient(to right, black 0%, rgba(0, 0, 0, 0.4) 100%);
    mask-image: linear-gradient(to right, black 0%, rgba(0, 0, 0, 0.4) 100%);

    z-index: 0;
}

.chart {
    height: 100px;
    width: 100%;
    position: relative;
    z-index: 1;
}
/* .chart{
   background-image: url('@/themes/icons/waves.svg');
    background-repeat: repeat-x;
    background-position: bottom;
    background-size: cover;
 } */
.header {
    text-align: left;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: #666;
}
</style>
