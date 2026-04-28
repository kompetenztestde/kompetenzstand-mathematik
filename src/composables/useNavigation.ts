import { computed, type ComputedRef } from 'vue'

interface Performer {
    label: string
    hits: number
    total: number
    percentage: number
}

export function useNavigation(
    competenceTopPerformers: ComputedRef<Performer[]>,
    guidingIdeaTopPerformers: ComputedRef<Performer[]>,
    badPerformers: ComputedRef<Performer[]>,
) {
    const allSteps = computed(() => {
        const steps = []

        steps.push({ path: '/step-1', sub: null })
        steps.push({ path: '/step-2', sub: null })
        steps.push({ path: '/step-3', sub: null })

        if (competenceTopPerformers.value.length > 0) {
            competenceTopPerformers.value.forEach((_, index) => {
                steps.push({ path: '/step-4', sub: index })
            })
        } else {
            steps.push({ path: '/step-4', sub: null })
        }

        if (guidingIdeaTopPerformers.value.length > 0) {
            guidingIdeaTopPerformers.value.forEach((_, index) => {
                steps.push({ path: '/step-5', sub: index })
            })
        } 
        // else {
        //     steps.push({ path: '/step-5', sub: null })
        // }

        if (badPerformers.value && badPerformers.value.length > 0) {
            steps.push({ path: '/step-6', sub: null })
        }
        steps.push({ path: '/step-7', sub: null })

        return steps
    })

    return { allSteps }
}
