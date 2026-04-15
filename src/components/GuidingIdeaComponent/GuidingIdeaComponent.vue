<script setup lang="ts">
import { useGuidingIdeas } from '@/composables/useGuidingIdeas'
import styles from './styles.module.css'
import layout from '@/assets/styles/component-layout.module.css'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SingleBarChart from '../SingleBarChart/SingleBarChart.vue'
import '@/assets/styles/base.css'
import { useModalStore } from '@/stores/modalStore'

const modalStore = useModalStore();

const route = useRoute()
const activeSubStep = computed(() => {
    const sId = route.params.subId
    return sId !== undefined ? Number(sId) : 0
})
const currentUserName = computed(() => route.query.user as string)

const { topPerformers } = useGuidingIdeas(currentUserName)

const currentItem = computed(() => topPerformers.value[activeSubStep.value])

const showDetails = () => {
    if (currentItem.value) {
        modalStore.openModal(
            currentItem.value.label, 
            currentItem.value.description 
        );
    }
};
</script>

<template>
    <div v-if="currentItem" :class="styles.statPaginator" >
        <div :class="layout.baseCard">
            <div :class="[layout.baseIllustration, styles.illustrationHeader]">
                <h2>{{ currentItem.label }}</h2>
                <img @click="showDetails" :class="styles.info" src="@/themes/icons/info.svg"/>
            </div>
            <div :class="layout.baseContentArea">
                <SingleBarChart :percentage="currentItem.percentage" />
                <span class="text-body">
                    {{ currentItem.text }}
                </span>
            </div>
        </div>
    </div>
</template>
