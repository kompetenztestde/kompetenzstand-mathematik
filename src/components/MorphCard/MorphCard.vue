<template>
  <div 
    class="icon-wrapper"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <Transition name="fade-morph" mode="out-in">
      <component 
        :is="icon" 
        :key="isHovered" 
        class="morph-icon"
        :class="{ 'is-active': isHovered }"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  icon: {
    type: Object,
    required: true
  }
})

const isHovered = ref(false)
</script>

<style scoped>
.icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 234px;
  height: 221px;
  cursor: pointer;
  perspective: 1000px; 
}

.morph-icon {
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.morph-icon.is-active {
  transform: scale(1.08) rotate(5deg);
}

.fade-morph-enter-active,
.fade-morph-leave-active {
  transition: opacity 0.1s ease, transform 0.1s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-morph-enter-from {
  opacity: 0;
  transform: scale(0.9) rotate(-5deg);
}

.fade-morph-leave-to {
  opacity: 0;
  transform: scale(1.1) rotate(5deg);
}
</style>