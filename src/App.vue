<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNavigation } from './composables/useNavigation'
import { useCompetences } from './composables/useCompetences'
import { useGuidingIdeas } from './composables/useGuidingIdeas'
import './assets/styles/variables.css'
import './assets/styles/base.css'
import { useI18n } from 'vue-i18n';
import SideModal from './components/SideModal/SideModal.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n();

const currentUserName = computed(() => route.query.user as string)

const { topPerformers: guidingIdeaTopPerformers, badPerformers } = useGuidingIdeas(currentUserName)
const { topPerformers: competencesTopPerformers } = useCompetences(currentUserName)
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

watch(
    () => route.fullPath,
    (newPath) => {
        console.log('Pfad:', newPath, 'Index:', currentIndex.value)
    },
)

watch(
    allSteps,
    (newList) => {
        console.log('Navigations-Liste aktualisiert. Einträge:', newList.length)
    },
    { immediate: true },
)
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
    <div class="appWrapper" :style="appBackground">
        <main class="content" :class="{ 'no-padding': isHome || isSecond }">
            <RouterView :key="route.fullPath" />
        </main>

        <SideModal />

        <footer v-if="!isHome" class="navigationBar">
            <h2 class="reportH1">{{t("home.feedback")}}</h2>
            <button :disabled="currentIndex <= 0" @click="goBack" class="navBtn" aria-label="Zurück">
                <img src="@/assets/svgs/page_left.svg" alt="" class="navIcon" />
            </button>
            <div class="pageIndicator">
                <div
                    v-for="(step, index) in allSteps"
                    :key="index"
                    class="dot"
                    :class="{ active: index === currentIndex }"
                    @click="goTo(index)"
                ></div>
            </div>
            <button
                :disabled="currentIndex >= allSteps.length - 1 || currentIndex === -1"
                @click="goNext"
                class="navBtn next"
                aria-label="Weiter"
            >
                <img src="@/assets/svgs/page_right.svg" alt="" class="navIcon" />
            </button>
        </footer>
    </div>
</template>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.appWrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--color-turquise);
    transition: background 0.5s ease;
}

.content {
    flex: 1;
    /* margin-bottom: 10dvh; */
}

.navigationBar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 10dvh;

    background: var(--color-turquise);
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding: 15px 20px 15px 20px; */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.navBtn {
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
}

.navBtn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

@media (min-width: 768px) {
    .navBtn {
        padding: 15px 40px;
    }
    .navigationBar{
        padding: 0px 20px 0px 20px;
    }
}

@media (max-width: 900px) {  
    .reportH1{
        display:none
    }
}

.pageIndicator {
    display: flex;
    gap: 12px;
    align-items: center;
}

.dot {
    width: 10px;
    height: 10px;
    background-color: var(--color-navigation-blue);
    border-radius: 50%;
    transition: all 0.3s ease;
    position: relative;
}

.dot.active {
    background-color: var(--color-navigation-blue);
    transform: scale(1.2);
}

.dot.active::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background-color: var(--color-white);
    border-radius: 50%;
    border: 1px solid var(--color-navigation-blue);
    opacity: 0.5;
}

.dot:hover {
    background-color: #bbb;
    transform: scale(1.1);
}

.appWrapper .content.no-padding {
    padding-bottom: 0 !important;
}
</style>
