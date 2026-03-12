<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNavigation } from './composables/useNavigation'
import { useCompetences } from './composables/useCompetences' // Importiere deine Datenquelle
import { useGuidingIdeas } from './composables/useGuidingIdeas'

const router = useRouter()
const route = useRoute()

const groupId = '8b-mathe'
const type = 'students'
const { topPerformers: guidingIdeaTopPerformers } = useGuidingIdeas(groupId, type)
const { topPerformers: competencesTopPerformers } = useCompetences(groupId, type)

const { allSteps } = useNavigation(competencesTopPerformers, guidingIdeaTopPerformers, groupId, type)

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
        router.push(targetPath)
    }
}

const goBack = () => {
    const prev = allSteps.value[currentIndex.value - 1]
    if (prev) {
        const targetPath = prev.sub !== null ? `${prev.path}/${prev.sub}` : prev.path
        router.push(targetPath)
    }
}

const goTo = (newIndex: number) => {
    const newPath = allSteps.value[newIndex]
    if (!newPath) return
    const targetPath = newPath.sub !== null ? `${newPath.path}/${newPath.sub}` : newPath.path

    router.push(targetPath)
}
const isFirstPage = computed(() => currentIndex.value <= 0)

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
</script>

<template>
    <div class="appWrapper">
        <main class="content">
            <RouterView :key="route.fullPath" />
        </main>

        <footer class="navigationBar">
            <button :disabled="currentIndex <= 0" @click="goBack" class="navBtn">Zurück</button>

            <div class="pageIndicator">
                <div
                    v-for="(step, index) in allSteps"
                    :key="index"
                    class="dot"
                    :class="{ active: index === currentIndex }"
                    @click="goTo(index)"
                ></div>
            </div>

            <button :disabled="currentIndex >= allSteps.length - 1 || currentIndex === -1" @click="goNext" class="navBtn next">
                Weiter
            </button>
        </footer>
    </div>
</template>
<style scoped>
.greeting {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
}
.appWrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    flex: 1;
    padding-bottom: 80px;
}

.navigationBar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: white;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.navBtn {
    padding: 10px 25px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
}

.navBtn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.navBtn.next {
    background: #42b883;
    color: white;
    border: none;
}

.startBtn {
    padding: 18px 45px;
    font-size: 1.4rem;
    font-weight: bold;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(66, 184, 131, 0.2);
    transition: all 0.3s ease;
}

.startBtn:hover {
    background-color: #3aa876;
    box-shadow: 0 15px 25px rgba(66, 184, 131, 0.3);
}

.startBtn:active {
    transform: translate(-50%, -48%);
}

@media (min-width: 768px) {
    .navBtn {
        padding: 15px 40px;
        font-size: 1.1rem;
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
    background-color: #ddd;
    border-radius: 50%;
    transition: all 0.3s ease;
    position: relative;
}

.dot.active {
    background-color: #42b883;
    transform: scale(1.2);
}

.dot.active::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid #42b883;
    border-radius: 50%;
    opacity: 0.5;
}

.dot:hover {
    background-color: #bbb; 
    transform: scale(1.1);
}
</style>
