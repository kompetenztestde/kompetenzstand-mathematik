<script setup>
import { useQuery } from '@tanstack/vue-query'
import { apiConfiguration } from '@/queries/utils'
import { GroupsApi } from '@tba3/api-resources'
import SlideAnimationComponent from '@/components/SlideAnimationComponent/SlideAnimationComponent.vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useOverallResults } from '@/composables/useOverallResults'
import { useI18n } from 'vue-i18n'
const route = useRoute()
const currentUserName = computed(() => route.query.user)
const id = '8b-mathe'
const types = 'students'
const { t } = useI18n()
const { overallResult } = useOverallResults(currentUserName)

const { data: data } = useQuery({
    queryKey: ['competence-levels', currentUserName.value],
    queryFn: async () => {
        if (!currentUserName.value) return []

        const config = await apiConfiguration()
        const api = new GroupsApi(config)

        const response = await api.getGroupCompetenceLevels({
            name: currentUserName.value,
            id: id,
            type: types,
        })
        const targetUser = response.find((u) => u.name === currentUserName.value)
        return targetUser?.competenceLevels ?? []
    },
    enabled: computed(() => !!currentUserName.value),
})

const level = computed(() => {
    return data.value?.[0]?.name || 0
})

watch(data, (newVal) => {
    if (newVal) {
        console.log('Value:', level.value)
    }
})

const handleRefresh = () => {
    window.location.reload()
}
</script>

<template>
    <div class="page">
        <div v-if="overallResult" class="result-header">
            <div class="header-top-row">
                <h2 class="result-title">{{ t('common.result') }}</h2>

                <div class="feedback-trigger" @click="handleRefresh">
                    <span class="feedback-text">{{ t('home.feedback') }}</span>
                    <img src="@/assets/svgs/refreshStarIcon.svg" class="edge-icon" alt="" />
                </div>
            </div>

            <div class="text-body-big resultText">
                {{ overallResult.text }}
            </div>
        </div>

        <div class="animation-container">
            <div class="feedback-trigger-animation" @click="handleRefresh">
                <h2 class="feedback-text">{{ t('home.feedback') }}</h2>
                <img src="@/assets/svgs/refreshStarIcon.svg" class="edge-icon" alt="" />
            </div>
            <SlideAnimationComponent :level="level" />
        </div>
    </div>
</template>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 10dvh);
}

.result-header {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 25px;
    background-color: var(--color-white);
    border-radius: 0 0 40px 40px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header-top-row {
    width: 100%;
    display: flex;
    justify-content: center;
}

.feedback-text {
    display: none;
}

.resultText {
    margin-top: 10px;
    padding: 0px 25px 10px 25px;
    text-align: center;
}

.edge-icon {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    cursor: pointer;
    width: 58px;
    height: 58px;
    z-index: 11;
}

.feedback-trigger-animation {
    display: none;
}

@media (min-width: 1300px) {
    .result-header {
        margin-left: 300px;
        margin-right: 300px;
    }
}

@media (max-width: 768px) {
    .page {
        flex-direction: column-reverse !important;
        justify-content: flex-end;
    }

    .result-header {
        position: relative;
        top: auto;
        border-radius: 0px;
        margin-top: auto;
        margin-bottom: 0;
        padding: 20px;
        margin-left: 0px;
        margin-right: 0px;
    }

    .header-top-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .result-title {
        text-align: center;
    }

    .feedback-trigger {
        display: none;
    }

    .feedback-trigger-animation {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        gap: 8px;
        cursor: pointer;
    }

    .feedback-text {
        display: inline;
        max-width: 200px;
        color: var(--color-navigation-blue);
    }

    .edge-icon {
        position: static;
        transform: none;
    }

    .resultText {
        padding: 0;
        text-align: left;
        margin-top: 5px;
    }
    .animation-container {
        margin-bottom: 0px;
    }
}
</style>
