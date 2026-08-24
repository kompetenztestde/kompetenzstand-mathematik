<script setup lang="ts">
import styles from './styles.module.css'
import GuidingIdeaComponent from '@/components/GuidingIdeaComponent/GuidingIdeaComponent.vue'
import { useGuidingIdeasNew } from '@/composables/useGuidingIdeasNew'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const route = useRoute()
const auth = useAuthStore()
const currentUserCode = computed(() => (route.query.user as string | undefined) || auth.studentCode || undefined)
const { topPerformers } = useGuidingIdeasNew(currentUserCode)
</script>

<template>
    <div :class="styles.page">
        <GuidingIdeaComponent :data="topPerformers" />
    </div>
</template>
