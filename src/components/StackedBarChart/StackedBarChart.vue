<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import styles from './styles.module.css';

use([SVGRenderer, BarChart, GridComponent]);

const props = defineProps<{
  correctAnswers: number;
  falseAnswers: number;
  notWorkedOn: number;
  total: number;
  label?: string;
}>();

const isOverLimit = computed(() => (props.correctAnswers + props.falseAnswers + props.notWorkedOn) > props.total);

const chartOption = computed(() => {
  const calcP = (val: number) => props.total > 0 ? ((val / props.total) * 100).toFixed(0) : '0';

  const commonConfig = {
    type: 'bar',
    stack: 'total',
    label: {
      show: true,
      formatter: (params: any) => (params.value / props.total) * 100 > 5 ? `${calcP(params.value)}%` : '',
      color: '#fff',
      fontSize: 11,
      fontWeight: 'bold'
    },
    emphasis: { disabled: true }
  };

  return {
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    xAxis: { type: 'value', max: props.total, show: false },
    yAxis: { type: 'category', data: ['Result'], show: false },
    series: [
      {
        ...commonConfig,
        name: 'Richtig',
        data: [props.correctAnswers],
        itemStyle: { color: '#42b883', borderRadius: [6, 0, 0, 6] }
      },
      {
        ...commonConfig,
        name: 'Falsch',
        data: [props.falseAnswers],
        itemStyle: { color: '#35495e' }
      },
      {
        ...commonConfig,
        name: 'Offen',
        data: [props.notWorkedOn],
        itemStyle: { color: '#64748b', borderRadius: [0, 6, 6, 0] }
      }
    ]
  };
});
</script>

<template>
  <div :class="styles.chartWrapper">
    <div v-if="label" :class="styles.chartLabel">
      {{ label }} <span :class="styles.totalHint">(Gesamt: {{ total }})</span>
    </div>

    <div :class="styles.floatingLabels">
      <div v-if="correctAnswers > 0" :class="styles.fLabel" :style="{ width: (correctAnswers/total*100) + '%' }">Richtig gelöst</div>
      <div v-if="falseAnswers > 0" :class="styles.fLabel" :style="{ width: (falseAnswers/total*100) + '%' }">Falsch gelöst</div>
      <div v-if="notWorkedOn > 0" :class="styles.fLabel" :style="{ width: (notWorkedOn/total*100) + '%' }">Nicht bearbeitet</div>
    </div>

    <div :class="styles.chartContainer">
      <VChart 
        :option="chartOption" 
        autoresize 
        :init-options="{ renderer: 'svg' }" 
      />
    </div>

    <p v-if="isOverLimit" :class="styles.error">
      Warnung: Summe der Werte übersteigt Gesamtanzahl!
    </p>
  </div>
</template>