<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNavigation } from './composables/useNavigation'
import './assets/styles/variables.css'
import './assets/styles/base.css'
import { useI18n } from 'vue-i18n'
import SideModal from './components/SideModal/SideModal.vue'
import { useGuidingIdeasNew } from './composables/useGuidingIdeasNew'
import { useCompetencesNew } from './composables/useCompetencesNew'
import styles from './styles.module.css'
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const currentUserCode = computed(() => route.query.user as string)

const { topPerformers: guidingIdeaTopPerformers, badPerformers, calculatedAreas, isLoading } = useGuidingIdeasNew(currentUserCode)
const { topPerformers: competencesTopPerformers } = useCompetencesNew(currentUserCode)

const { allSteps } = useNavigation(competencesTopPerformers, guidingIdeaTopPerformers, badPerformers)

const currentIndex = computed(() => {
    const pathSegments = route.path.split('/').filter(Boolean)
    const currentBase = pathSegments[0]
    const currentSub = route.params.subId !== undefined ? Number(route.params.subId) : null

    return allSteps.value.findIndex((s) => {
        const stepBase = s.path.replace(/\//g, '')
        const pathMatches = currentBase === stepBase

        let subMatches = false
        if (s.sub === null && currentSub === null) subMatches = true
        if (s.sub !== null && currentSub !== null && Number(s.sub) === currentSub) subMatches = true

        if (pathMatches && s.sub === 0 && currentSub === null) subMatches = true
        if (pathMatches && s.sub === null && currentSub === 0) subMatches = true

        return pathMatches && subMatches
    })
})

const goNext = () => {
    const next = allSteps.value[currentIndex.value + 1]
    if (next) {
        const targetPath = next.sub !== null ? `${next.path}/${next.sub}` : next.path
        router.push({
            path: targetPath,
            query: { user: route.query.user },
        })
    }
}

const goBack = () => {
    const prev = allSteps.value[currentIndex.value - 1]
    if (prev) {
        const targetPath = prev.sub !== null ? `${prev.path}/${prev.sub}` : prev.path
        router.push({
            path: targetPath,
            query: { user: route.query.user },
        })
    }
}

const goTo = (newIndex: number) => {
    const newPath = allSteps.value[newIndex]
    if (!newPath) return
    const targetPath = newPath.sub !== null ? `${newPath.path}/${newPath.sub}` : newPath.path

    router.push({
        path: targetPath,
        query: { user: route.query.user },
    })
}

const isHome = computed(() => route.path === '/step-1' || route.path === '/')
const isSecond = computed(() => route.path === '/step-2')

const appBackground = computed(() => {
    if (isHome.value || isSecond.value) {
        return { background: 'linear-gradient(180deg, #87F9F5 0%, #FFF 90.2%)' }
    }
    return { backgroundColor: 'var(--color-turquise)' }
})
</script>

<template>
    <div :class="styles.appWrapper" :style="appBackground">
        <!-- <main class="content" :class="(styles.content, { 'no-padding': isHome || isSecond })">
            <RouterView :key="route.fullPath" />
        </main> -->
        <main :class="[styles.content, { 'no-padding': isHome || isSecond }]">
    <RouterView :key="route.fullPath" />
</main>

        <SideModal />

        <footer v-if="!isHome" :class="styles.navigationBar">
            <h2 :class="styles.reportH1">{{ t('home.feedback') }}</h2>
            <button :disabled="currentIndex <= 0" @click="goBack" :class="styles.navBtn" aria-label="Zurück">
                <img src="@/assets/svgs/page_left.svg" alt="" :class="styles.navIcon" />
            </button>
            <div :class="styles.pageIndicator">
                <div
                    v-for="(step, index) in allSteps"
                    :key="index"
                    :class="`${styles.dot} ${index === currentIndex ? styles.active : ''}`"
                    @click="goTo(index)"
                ></div>
            </div>
            <button
                :disabled="currentIndex >= allSteps.length - 1 || currentIndex === -1"
                @click="goNext"
                :class="[styles.navBtn, styles.next]"
                aria-label="Weiter"
            >
                <img src="@/assets/svgs/page_right.svg" alt="" :class="styles.navIcon" />
            </button>
        </footer>
    </div>
</template>
<style>
.appWrapper .content.no-padding {
    padding-bottom: 0 !important;
    min-height: calc(100dvh - 15dvh - 40px);
}
</style>
