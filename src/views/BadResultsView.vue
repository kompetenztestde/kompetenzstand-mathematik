<script setup lang="ts">
import { useGuidingIdeas } from '@/composables/useGuidingIdeas'
import '../assets/styles/variables.css'
import { useI18n } from 'vue-i18n'
const route = useRoute()
const currentUserName = computed(() => route.query.user as string)

const { t } = useI18n()
const { badPerformers, calculatedAreas } = useGuidingIdeas(currentUserName);
import BarCharts from '@/components/BarCharts/BarCharts.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

</script>
<template>
    <div class="page">
        <h1>{{ t('badResults.title') }}</h1>
        <span>{{ t('badResults.text') }}</span>
        <BarCharts :badPerformers="badPerformers" :areas="calculatedAreas" />
    </div>
</template>

<style scoped>
.page {
    margin: 40px 20px;
    padding: 20px;
    border-radius: 20;
    border-radius: 20px;
    background: var(--color-white);
    box-shadow: 0 0 20px 0 rgba(34, 92, 115, 0.1);
    text-align: center;
    color: var(--color-navigation-blue);
    min-height: calc(100dvh - 10dvh - 40px);
}

h1 {
    padding: 10px;
}
</style>
