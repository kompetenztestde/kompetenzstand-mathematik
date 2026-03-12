<!-- <script setup lang="ts">
import { ref, computed } from 'vue';
import styles from './styles.module.css'

const props = defineProps<{
  items: Array<{
    label: string;
    hits: number;
    total: number;
    percentage: number;
  }>
}>();

const currentIndex = ref(0);

const currentItem = computed(() => props.items[currentIndex.value]);

const next = () => {
  if (currentIndex.value < props.items.length - 1) currentIndex.value++;
};

const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};
</script>

<template>
  <div v-if="items.length > 0" :class="styles.statPaginator">
    <div :class="styles.card">
      <h3>{{ currentItem?.label }}</h3>
      <p>{{ currentItem?.hits }} von {{ currentItem?.total }} Aufgaben gelöst</p>

      <div :class="styles.barBg">
        <div :class="styles.barFill" :style="{ width: currentItem?.percentage + '%' }"></div>
      </div>
      <span :class="styles.percentageLabel">{{ currentItem?.percentage }}%</span>
    </div>

    <div :class="styles.controls" v-if="items.length > 1">
      <button @click="prev" :disabled="currentIndex === 0">◀</button>
      
      <div :class="styles.dots">
        <span 
          v-for="(_, index) in items" 
          :key="index"
          :class="[styles.miniDot, { [styles.active ?? '']: index === currentIndex }]"
        ></span>
      </div>

      <button @click="next" :disabled="currentIndex === items.length - 1">▶</button>
    </div>
  </div>
  
  <div v-else :class="styles.emptyState">
    Noch keine Ergebnisse über 80%.
  </div>
</template> -->

<script setup lang="ts">
import { useGuidingIdeas } from '@/composables/useGuidingIdeas';
import styles from './styles.module.css'
import { computed } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute();
const activeSubStep = computed(() => {
  const sId = route.params.subId;
  return sId !== undefined ? Number(sId) : 0;
});
const { topPerformers } = useGuidingIdeas('8b-mathe', 'students')

const currentItem = computed(() => topPerformers.value[activeSubStep.value])
</script>

<template>
  <div v-if="currentItem" :class="styles.statPaginator">
    <div :class="styles.card">
      <h3>{{ currentItem.label }}</h3>
      </div>    
    </div>
</template>