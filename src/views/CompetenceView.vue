<script setup lang="ts">
import { useCompetences } from '@/composables/useCompetences'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const id = '8b-mathe'
const types = 'students'
const route = useRoute()
const { topPerformers } = useCompetences(id, types)
const activeSubStep = computed(() => parseInt(route.params.subId as string) || 0)
const currentItem = computed(() => topPerformers.value[activeSubStep.value])
</script>

<template>
    <div class="page">
        <h1>Kompetenzstärke</h1>
        <div v-if="currentItem" class="contentWrapper">
            <div v-if="currentItem" class="card">
                <h3>{{ currentItem.label }}</h3>
                <span class="text">{{ currentItem.text }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    padding: 40px 20px;
    text-align: center;
    min-height: 100vh;
}

.container {
    width: 50%;
    padding: 16px;
    margin: auto;
}

h3 {
    font-size: 24px;
    margin: 0 0 12px 0;
    color: #2d3436;
}

.contentWrapper {
    display: flex;
    justify-content: center; 
    align-items: center;    
}

.text {
    font-size: 16px;
    line-height: 1.6;
    color: #4a5568;
    margin: 0;
}

.card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    border: 1px solid #edf2f7;
    transition: transform 0.2s ease;
    width: 100%;
    max-width: 400px;
}
</style>
