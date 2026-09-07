<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { inioApiConfiguration } from '@/queries/utils'
import SlideAnimationComponent from '@/components/SlideAnimationComponent/SlideAnimationComponent.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { normalizeStudentCode, useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { ReportDataTba3Api } from '@tba3/api-new'
import { useOverallResultsNew } from '@/composables/useOverallResultsNew'
import { LEVEL_MAP, ROMAN_TO_LABEL, type LevelLabel } from '@/types'
import { useGuidingIdeasNew } from '@/composables/useGuidingIdeasNew'
import styles from './styles.module.css'
import { useUserItemsNew } from '@/composables/useUserItems'
import RefreshIcon from '@/assets/svgs/refreshStarIcon.svg?component'
const route = useRoute()
const auth = useAuthStore()
const currentUserCode = computed<string | undefined>(() => {
    const user = route.query.user
    if (Array.isArray(user)) {
        return user[0] ?? undefined
    }

    return user ?? auth.studentCode ?? undefined
})
const { t } = useI18n()
const { overallResult } = useOverallResultsNew(currentUserCode)
const { calculatedAreas } = useGuidingIdeasNew(currentUserCode)

const { data: data } = useQuery({
    queryKey: ['competence-levels', currentUserCode.value],
    queryFn: async () => {
        if (!currentUserCode.value) return []
        const normalizedCode = normalizeStudentCode(currentUserCode.value)!

        const config = await inioApiConfiguration()
        const api = new ReportDataTba3Api(config)

        const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdCompetenceLevelsGet({
            tgId: auth.reportTestGroupId!,
            groupId: auth.reportGroupId!,
            testId: auth.reportTestId!,
            schoolId: auth.studentSchoolId ?? undefined,
            type: 'students',
            studentCode: normalizedCode,
        })
        const students = response.data?.studentsData ?? []

        const targetUser = students.find((u) => u.code === normalizedCode)
        return targetUser?.competenceLevels ?? []
    },
    enabled: computed(() => !!currentUserCode.value && !!auth.reportTestGroupId && !!auth.reportGroupId && !!auth.reportTestId),
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
    const rawValue = data.value?.[0]?.value
    if (!rawValue) return undefined

    return ROMAN_TO_LABEL[rawValue]
})

const levelNumber = computed(() => {
    return levelLabel.value ? LEVEL_MAP[levelLabel.value] : 0
})
const { stats } = useUserItemsNew(currentUserCode)

const showMobileFeedback = ref(false)

const handleAnimationFinished = () => {
    showMobileFeedback.value = true
}

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
    <div :class="styles.page" class="noPaddingPage noOverflowPage">
        <div v-if="overallResult" :class="styles.resultHeader">
            <div :class="styles.headerTopRow">
                <h1 :class="styles.resultTitle">{{ t('common.result') }}</h1>

                <div :class="styles.feedbackTrigger">
                    <span :class="styles.feedbackText">{{ t('home.feedback') }}</span>
                    <button type="button" @click="handleRefresh" :class="styles.iconButtonOnly" :aria-label="t('home.feedback')">
                        <RefreshIcon :class="styles.edgeIcon" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div class="text-body" :class="styles.resultText">
                {{ overallResult.text }}
            </div>
        </div>

        <div :class="styles.animationContainer">
            <div :class="styles.feedbackTriggerAnimation">
                <h2 v-if="showMobileFeedback" :class="styles.feedbackText">{{ t('home.feedback') }}</h2>
            </div>
            <SlideAnimationComponent
                :areas="calculatedAreas"
                :level="levelLabel"
                :score="levelNumber"
                :correctScore="stats.correct"
                @animation-finished="handleAnimationFinished"
            />
            <div v-if="showMobileFeedback" :class="styles.buttonRefreshRow">
                <button type="button" @click="handleRefresh" :class="styles.edgeIconButton" :aria-label="t('home.feedback')">
                    <RefreshIcon :class="styles.edgeIcon" aria-hidden="true" />
                </button>
                <span :class="styles.refreshButtonText">nochmal abspielen</span>
            </div>
        </div>
    </div>
</template>
