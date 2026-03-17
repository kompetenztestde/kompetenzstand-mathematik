<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, MarkLineComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([SVGRenderer, BarChart, GridComponent, MarkLineComponent]);

const props = defineProps<{
  percentage: number;
  label?: string;
}>();

const chartOption = computed(() => {
  let color = ['#ff8787', '#ff6b6b']; 
  if (props.percentage >= 33 && props.percentage < 66) color = ['#ffd43b', '#fcc419']; 
  if (props.percentage >= 66) color = ['#63e6be', '#42b883']; 

  return {
    renderer: 'svg',
    grid: {
      top: 30,
      bottom: 0,
      left: 10,
      right: 40, 
      containLabel: false
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 50,
      splitLine: {
        show: true,
        lineStyle: { color: 'rgba(0,0,0,0.05)' }
      },
      axisLabel: {
        show: true,
        formatter: '{value}%',
        align: 'center',
        margin: 15,
        position: 'top', 
        color: '#aaa',
        fontSize: 10
      },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: ['Ergebnis'],
      show: false
    },
    series: [
      {
        type: 'bar',
        data: [props.percentage],
        barWidth: 28,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: color[0] },
              { offset: 1, color: color[1] }
            ]
          }
        },
        label: {
          show: true,
          position: 'insideRight',
          formatter: '{c}%',
          color: '#fff',
          fontWeight: 'bold',
          distance: 10
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(0, 0, 0, 0.05)',
          borderRadius: 6
        }
      }
    ]
  };
});
</script>

<template>
  <div class="chart-container">
    <h5 class="header">Dein Ergebnis</h5>
    <VChart class="chart" :option="chartOption" :init-options="{ renderer: 'svg' }" />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
}
.chart {
  height: 100px;
  width: 100%;
}
.header {
  text-align: left;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
}
</style>