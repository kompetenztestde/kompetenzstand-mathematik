<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
const { t } = useI18n()
</script>
<template>
    <div :class="styles.page">
        <h1>{{ t('finalView.title') }}</h1>
        <span>{{ t('finalView.text') }}</span>
    </div>
</template>
