<script setup lang="ts">
import layout from '@/assets/styles/component-layout.module.css'
import { useCompetencesNew } from '@/composables/useCompetencesNew'
import { useModalStore } from '@/stores/modalStore'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Trophy from './icons/trophy.png'
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
const modalStore = useModalStore()
const route = useRoute()
const currentUserCode = computed(() => route.query.user as string)
const { topPerformers } = useCompetencesNew(currentUserCode)
const { t } = useI18n()

const activeSubStep = computed(() => parseInt(route.params.subId as string) || 0)
const currentItem = computed(() => topPerformers.value[activeSubStep.value])

const showDetails = () => {
    if (currentItem.value) {
        modalStore.openModal(currentItem.value.label, currentItem.value.description)
    }
}
</script>

<template>
    <div :class="styles.page">
        <div v-if="currentItem" :class="styles.contentWrapper">
            <div v-if="currentItem" :class="layout.baseCard">
                <div :class="[layout.baseIllustration, styles.illustrationHeader]">
                    <!-- <h2>{{ currentItem.label }}</h2>
                    <img @click="showDetails" class="mobile-hint info" src="@/themes/icons/info.svg"/> -->
                    <div :class="styles.titleRow">
                        <h1>{{ currentItem.label }}</h1>
                        <img @click="showDetails" :class="[styles.mobileHint, styles.info]" src="@/themes/icons/info.svg" />
                    </div>
                    <img :src="Trophy" :class="styles.trophyImg" alt="Illustration" />
                </div>
                <div :class="layout.baseContentArea">
                    <h1>{{ t('competence.result') }}</h1>
                    <span class="text-body-big">{{ currentItem.text }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
