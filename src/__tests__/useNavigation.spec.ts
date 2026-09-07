import { describe, it, expect } from 'vitest'
import { computed, ref } from 'vue'
import { useNavigation } from '@/composables/useNavigation'

interface Performer {
    label: string
    hits: number
    total: number
    percentage: number
}

describe('useNavigation', () => {
    const createPerformer = (label: string): Performer => ({
        label,
        hits: 5,
        total: 10,
        percentage: 50,
    })

    it('sollte Standard-Schritte rendern, wenn alle Performer-Listen leer sind', () => {
        const competenceTopPerformers = computed<Performer[]>(() => [])
        const guidingIdeaTopPerformers = computed<Performer[]>(() => [])
        const badPerformers = computed<Performer[]>(() => [])

        const { allSteps } = useNavigation(competenceTopPerformers, guidingIdeaTopPerformers, badPerformers)

        expect(allSteps.value).toEqual([
            { path: '/step-1', sub: null },
            { path: '/step-2', sub: null },
            { path: '/step-3', sub: null },
            { path: '/step-4', sub: null },
            { path: '/step-7', sub: null },
        ])
    })

    it('sollte für competenceTopPerformers Sub-Steps in step-4 anlegen', () => {
        const competenceTopPerformers = computed<Performer[]>(() => [createPerformer('Comp 1'), createPerformer('Comp 2')])
        const guidingIdeaTopPerformers = computed<Performer[]>(() => [])
        const badPerformers = computed<Performer[]>(() => [])

        const { allSteps } = useNavigation(competenceTopPerformers, guidingIdeaTopPerformers, badPerformers)

        const step4Items = allSteps.value.filter((s) => s.path === '/step-4')
        expect(step4Items).toEqual([
            { path: '/step-4', sub: 0 },
            { path: '/step-4', sub: 1 },
        ])
    })

    it('sollte für guidingIdeaTopPerformers Sub-Steps in step-5 anlegen', () => {
        const competenceTopPerformers = computed<Performer[]>(() => [])
        const guidingIdeaTopPerformers = computed<Performer[]>(() => [createPerformer('Guide 1'), createPerformer('Guide 2')])
        const badPerformers = computed<Performer[]>(() => [])

        const { allSteps } = useNavigation(competenceTopPerformers, guidingIdeaTopPerformers, badPerformers)

        const step5Items = allSteps.value.filter((s) => s.path === '/step-5')
        expect(step5Items).toEqual([
            { path: '/step-5', sub: 0 },
            { path: '/step-5', sub: 1 },
        ])
    })

    it('sollte bei <= 2 badPerformers Sub-Steps für step-6 anlegen', () => {
        const competenceTopPerformers = computed<Performer[]>(() => [])
        const guidingIdeaTopPerformers = computed<Performer[]>(() => [])
        const badPerformers = computed<Performer[]>(() => [createPerformer('Bad 1'), createPerformer('Bad 2')])

        const { allSteps } = useNavigation(competenceTopPerformers, guidingIdeaTopPerformers, badPerformers)

        const step6Items = allSteps.value.filter((s) => s.path === '/step-6')
        expect(step6Items).toEqual([
            { path: '/step-6', sub: 0 },
            { path: '/step-6', sub: 1 },
        ])
    })

    it('sollte bei > 2 badPerformers nur einen einzelnen step-6 ohne Sub-Index anlegen', () => {
        const competenceTopPerformers = computed<Performer[]>(() => [])
        const guidingIdeaTopPerformers = computed<Performer[]>(() => [])
        const badPerformers = computed<Performer[]>(() => [createPerformer('Bad 1'), createPerformer('Bad 2'), createPerformer('Bad 3')])

        const { allSteps } = useNavigation(competenceTopPerformers, guidingIdeaTopPerformers, badPerformers)

        const step6Items = allSteps.value.filter((s) => s.path === '/step-6')
        expect(step6Items).toEqual([{ path: '/step-6', sub: null }])
    })

    it('sollte dynamisch auf reaktive Änderungen der Inputs reagieren', () => {
        const guideList = ref<Performer[]>([])
        const competenceTopPerformers = computed<Performer[]>(() => [])
        const guidingIdeaTopPerformers = computed<Performer[]>(() => guideList.value)
        const badPerformers = computed<Performer[]>(() => [])

        const { allSteps } = useNavigation(competenceTopPerformers, guidingIdeaTopPerformers, badPerformers)

        expect(allSteps.value.some((s) => s.path === '/step-5')).toBe(false)

        guideList.value = [createPerformer('New Guide')]

        expect(allSteps.value.some((s) => s.path === '/step-5')).toBe(true)
        expect(allSteps.value.find((s) => s.path === '/step-5')).toEqual({
            path: '/step-5',
            sub: 0,
        })
    })
})
