<script setup lang="ts">
import layout from '@/assets/styles/component-layout.module.css'
import { useCompetences } from '@/composables/useCompetences'
import { useModalStore } from '@/stores/modalStore';
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const modalStore = useModalStore();
const route = useRoute()
const currentUserName = computed(() => route.query.user as string)
const { topPerformers } = useCompetences(currentUserName)
const activeSubStep = computed(() => parseInt(route.params.subId as string) || 0)
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
    <div class="page">
        <div v-if="currentItem" class="contentWrapper" >
            <div v-if="currentItem" :class="layout.baseCard">
                <div :class="layout.baseIllustration" class="illustration-header">
                    <h2>{{ currentItem.label }}</h2>
                    <img @click="showDetails" class="mobile-hint info" src="@/themes/icons/info.svg"/>
                </div>
                <div :class="layout.baseContentArea">
                    <span class="text-body-big">{{ currentItem.text }}</span>                    
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    padding: 40px 20px;
    text-align: center;
}
.contentWrapper {
    display: flex;
    justify-content: center;
    min-height: calc(100dvh - 10dvh - 40px);
}

.info{
    cursor:pointer;
}

.illustration-header {
    display: flex;
    flex-direction: row; 
    align-items: center; 
    justify-content: center; 
    gap: 12px; 
    width: 100%;
}

.illustration-header h2 {
    margin: 0;
}

</style>
