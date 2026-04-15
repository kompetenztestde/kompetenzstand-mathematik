<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
    <div class="page">
        <h1>{{ t('finalView.title') }}</h1>
        <span>{{ t('finalView.text') }}</span>
    </div>
</template>

<style scoped>
.page {
    padding: 40px 20px;
    text-align: center;
    background-color: var(--color-white);
    margin: 40px 20px;
    border-radius: 20px;
    box-shadow: 0 0 20px 0 rgba(34, 92, 115, 0.1);
    text-align: center;
    color: var(--color-navigation-blue);
    min-height: calc(100dvh - 10dvh - 40px);
}
</style>
