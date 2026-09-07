import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import GuidingIdeaView from '@/views/GuidingIdeaView/GuidingIdeaView.vue'
import GuidingIdeaComponent from '@/components/GuidingIdeaComponent/GuidingIdeaComponent.vue'

const mockUserQuery = ref<string | undefined>('USER_123')
vi.mock('vue-router', () => ({
    useRoute: () => ({
        query: { user: mockUserQuery.value },
    }),
}))

const mockTopPerformers = ref([
    { id: 1, title: 'Top-Idee A' },
    { id: 2, title: 'Top-Idee B' },
])
const useGuidingIdeasNewSpy = vi.fn()

vi.mock('@/composables/useGuidingIdeasNew', () => ({
    useGuidingIdeasNew: (userCode: any) => {
        useGuidingIdeasNewSpy(userCode?.value)
        return {
            topPerformers: mockTopPerformers,
        }
    },
}))

describe('GuidingIdeaView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUserQuery.value = 'USER_123'
    })

    const mountComponent = () => {
        return mount(GuidingIdeaView, {
            global: {
                stubs: {
                    GuidingIdeaComponent: true,
                },
            },
        })
    }

    it('sollte GuidingIdeaComponent rendern', () => {
        const wrapper = mountComponent()
        expect(wrapper.findComponent(GuidingIdeaComponent).exists()).toBe(true)
    })

    it('sollte topPerformers als Prop an GuidingIdeaComponent übergeben', () => {
        const wrapper = mountComponent()
        const guidingIdeaComp = wrapper.findComponent(GuidingIdeaComponent)

        expect(guidingIdeaComp.props('data')).toEqual([
            { id: 1, title: 'Top-Idee A' },
            { id: 2, title: 'Top-Idee B' },
        ])
    })

    it('sollte den User-Code aus den Route-Querys an useGuidingIdeasNew übergeben', () => {
        mockUserQuery.value = 'CUSTOM_USER_99'
        mountComponent()

        expect(useGuidingIdeasNewSpy).toHaveBeenCalledWith('CUSTOM_USER_99')
    })
})
