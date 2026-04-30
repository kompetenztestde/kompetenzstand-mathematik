<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { inioApiConfiguration } from '@/queries/utils'
import SlideAnimationComponent from '@/components/SlideAnimationComponent/SlideAnimationComponent.vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ReportDataTba3Api } from '@tba3/api-new'
import { useOverallResultsNew } from '@/composables/useOverallResultsNew'
import { LEVEL_MAP, ROMAN_TO_LABEL, type LevelLabel } from '@/types'
import { useGuidingIdeasNew } from '@/composables/useGuidingIdeasNew'
import styles from './styles.module.css'
import { useUserItemsNew } from '@/composables/useUserItems'
import RefreshIcon from '@/assets/svgs/refreshStarIcon.svg?component'
const route = useRoute()
const currentUserCode = computed<string | undefined>(() => {
    const user = route.query.user
    if (Array.isArray(user)) {
        return user[0] ?? undefined
    }

    return user ?? undefined
})
const { t } = useI18n()
const { overallResult } = useOverallResultsNew(currentUserCode)
const { calculatedAreas } = useGuidingIdeasNew(currentUserCode)

const { data: data } = useQuery({
    queryKey: ['competence-levels', currentUserCode.value],
    queryFn: async () => {
        if (!currentUserCode.value) return []

        const config = await inioApiConfiguration()
        const api = new ReportDataTba3Api(config)

        const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet({
            tgId: 270,
            groupId: 1001,
            testId: 9524,
            type: 'students',
            studentCode: currentUserCode.value as string,
        })
        const students = response.data?.studentsData ?? []

        const targetUser = students.find((u) => u.code === currentUserCode.value)
        return targetUser?.competenceLevels ?? []
    },
    enabled: computed(() => !!currentUserCode.value),
})

const level = computed(() => {
    const rawValue = data.value?.[0]?.value
    if (!rawValue) return 0

    const mapping: Record<string, number> = {
        I: 1,
        II: 2,
        III: 3,
        IV: 4,
        V: 5,
    }

    return mapping[rawValue] || 0
})

const levelLabel = computed<LevelLabel | undefined>(() => {
    const rawValue = data.value?.[0]?.value // z.B. "III"
    if (!rawValue) return undefined

    return ROMAN_TO_LABEL[rawValue]
})

const levelNumber = computed(() => {
    return levelLabel.value ? LEVEL_MAP[levelLabel.value] : 0
})
const { stats } = useUserItemsNew(currentUserCode)

watch(
    data,
    (newVal) => {
        if (newVal && newVal.length > 0) {
            console.log('Rohdaten:', newVal)
            console.log('Berechnetes Level:', level.value)
            console.log('TOTAL:', stats.value.total)
            console.log('PERCENTAGE', stats.value.percentage)
            console.log('CORRECT', stats.value.correct)
        }
    },
    { immediate: true },
)

const handleRefresh = () => {
    window.location.reload()
}
</script>

<template>
    <div :class="styles.page">
        <div v-if="overallResult" :class="styles.resultHeader">
            <div :class="styles.headerTopRow">
                <h2 :class="styles.resultTitle">{{ t('common.result') }}</h2>

                <div :class="styles.feedbackTrigger">
                    <span :class="styles.feedbackText">{{ t('home.feedback') }}</span>
                    <button type="button" @click="handleRefresh" :class="styles.iconButtonOnly" :aria-label="t('home.feedback')">
                        <!-- <img src="@/assets/svgs/refreshStarIcon.svg" :class="styles.edgeIcon" alt="" aria-hidden="true" /> -->
                        <RefreshIcon :class="styles.edgeIcon" aria-hidden="true"/>
                    </button>
                </div>
            </div>

            <div class="text-body-big" :class="styles.resultText">
                {{ overallResult.text }}
            </div>
        </div>

        <div :class="styles.animationContainer">
            <div :class="styles.feedbackTriggerAnimation" >
                <h2 :class="styles.feedbackText">{{ t('home.feedback') }}</h2>
                <button type="button" @click="handleRefresh" :class="styles.edgeIcon" :aria-label="t('home.feedback')">
                    <!-- <img src="@/assets/svgs/refreshStarIcon.svg" alt="" aria-hidden="true" /> -->
                     <RefreshIcon aria-hidden="true"/>
                </button>
            </div>
            <SlideAnimationComponent :areas="calculatedAreas" :level="levelLabel" :score="levelNumber" :correctScore="stats.correct" />
        </div>
    </div>
</template>
