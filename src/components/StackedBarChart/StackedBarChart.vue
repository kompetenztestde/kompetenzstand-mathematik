<script setup lang="ts">
import { computed } from 'vue';
import styles from './styles.module.css';

const props = defineProps<{
  correctAnswers: number;
  falseAnswers: number;
  notWorkedOn: number;
  total: number; 
  label?: string;
}>();

const calcPercent = (val: number) => {
  if (props.total <= 0) return 0;
  return (val / props.total) * 100;
};

const p1 = computed(() => calcPercent(props.correctAnswers));
const p2 = computed(() => calcPercent(props.falseAnswers));
const p3 = computed(() => calcPercent(props.notWorkedOn));

const isOverLimit = computed(() => (props.correctAnswers + props.falseAnswers + props.notWorkedOn) > props.total);
</script>

<template>
  <div :class="styles.chartWrapper">
    <div v-if="label" :class="styles.chartLabel">
      {{ label }} <span :class="styles.totalHint">(Gesamt: {{ total }})</span>
    </div>

    <div :class="styles.progressContainer">
      <div 
        :class="[styles.segment, styles.segment1]" 
        :style="{ width: p1 + '%' }"
        :title="`Wert 1: ${correctAnswers}`"
      >
      <div v-if="p1 > 0" :class="styles.floatingLabel">Richtig gelöst</div>
        <span v-if="p1 > 5" :class="styles.segmentText">{{ p1.toFixed(0) }} %</span>
      </div>

      <div 
        :class="[styles.segment, styles.segment2]" 
        :style="{ width: p2 + '%' }"
        :title="`Wert 2: ${falseAnswers}`"
      >
      <div v-if="p2 > 0" :class="styles.floatingLabel">Falsch gelöst</div>
        <span v-if="p2 > 5" :class="styles.segmentText">{{ p2.toFixed(0) }} %</span>
      </div>

      <div 
        :class="[styles.segment, styles.segment3]" 
        :style="{ width: p3 + '%' }"
        :title="`Wert 3: ${notWorkedOn}`"
      >
      <div v-if="p3 > 0" :class="styles.floatingLabel">Nicht bearbeitet</div>
        <span v-if="p3 > 5" :class="styles.segmentText">{{ notWorkedOn.toFixed(0) }} %</span>
      </div>
    </div>

    <p v-if="isOverLimit" :class="styles.error">Warnung: Summe der Werte übersteigt Gesamtanzahl!</p>
  </div>
</template>