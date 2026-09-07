import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SlideAnimationComponent from '../../components/SlideAnimationComponent/SlideAnimationComponent.vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('@lottiefiles/dotlottie-vue', () => ({
    DotLottieVue: defineComponent({
        name: 'DotLottieVue',
        props: ['data', 'autoplay', 'loop', 'speed', 'renderSettings'],
        render() {
            return h('div', { class: 'dot-lottie-stub' })
        },
    }),
}))

vi.mock('../../assets/animations/Scene_2_V2_moving.json', () => ({ default: {} }))
vi.mock('../../assets/animations/Scene_3.json', () => ({ default: {} }))
vi.mock('../../assets/animations/Sample_2_Scenes_1-3.json', () => ({ default: {} }))

vi.mock('../../components/SlideAnimationComponent/styles.module.css', () => {
    const classes = {
        introContainer: 'introContainer',
        fixedIntroWaves: 'fixedIntroWaves',
        introMovable: 'introMovable',
        scene1Style: 'scene1Style',
        sliderWrapper: 'sliderWrapper',
        movableContainer: 'movableContainer',
        scene3Style: 'scene3Style',
        triangleBottom: 'triangleBottom',
        scaleLabels: 'scaleLabels',
        label: 'label',
    }
    return { ...classes, default: classes }
})

describe('SlideAnimationComponent.vue', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.useRealTimers()
    })

    const mountComponent = (props: { score: number; correctScore: number; areas?: number[]; level?: any } = { score: 10, correctScore: 21.5, areas: [30, 70] }) => {
        return mount(SlideAnimationComponent, {
            props,
            global: {
                stubs: {
                    Transition: {
                        template: '<div><slot /></div>',
                    },
                },
            },
        })
    }

    it('starts in step 1 and renders intro container', () => {
        const wrapper = mountComponent()

        expect(wrapper.find('.introContainer').exists()).toBe(true)
        expect(wrapper.find('.sliderWrapper').exists()).toBe(false)
        expect(wrapper.find('.dot-lottie-stub').exists()).toBe(true)
    })

    it('calculates dynamic mask correctly based on areas prop', async () => {
        const wrapper = mountComponent({ score: 10, correctScore: 20, areas: [25, 75] })

        vi.advanceTimersByTime(13500)
        await flushPromises()

        const sliderTrack = wrapper.find('.sliderTrack')
        expect(sliderTrack.exists()).toBe(true)
        const styleAttribute = sliderTrack.attributes('style')
        expect(styleAttribute).toContain('--mask:')
        expect(styleAttribute).toContain('25%')
        expect(styleAttribute).toContain('75%')
    })

   it('progresses through step 1, step 2, and step 3, emitting animation-finished', async () => {
        const wrapper = mountComponent()

        const vm = wrapper.vm as any

        vi.advanceTimersByTime(12000)
        await flushPromises()
        expect(vm.isIntroSliding).toBe(true)

        vi.advanceTimersByTime(1500)
        await flushPromises()
        expect(vm.step).toBe(2)
        expect(wrapper.find('.introContainer').exists()).toBe(false)
        expect(wrapper.find('.sliderWrapper').exists()).toBe(true)

        vi.advanceTimersByTime(800)
        await flushPromises()
        expect(vm.isSliding).toBe(true)

        vi.advanceTimersByTime(1800)
        await flushPromises()

        expect(vm.step).toBe(3)
        expect(wrapper.emitted('animation-finished')).toBeTruthy()
        expect(wrapper.emitted('animation-finished')).toHaveLength(1)
    })

    it('calculates correct sliding percentage position', async () => {
        const wrapper = mountComponent({ score: 10, correctScore: 21.5 })

        vi.advanceTimersByTime(14300)
        await flushPromises()

        const movableContainer = wrapper.find('.movableContainer')
        expect(movableContainer.attributes('style')).toContain('left: 50%')
    })

    it('shows desktop scale labels when width is >= 768px', async () => {
        const wrapper = mountComponent()

        vi.advanceTimersByTime(13500)
        await flushPromises()

        const labels = wrapper.findAll('.label')
        expect(labels[0].text()).toBe('areas.first')
        expect(labels[1].text()).toBe('areas.middle')
        expect(labels[2].text()).toBe('areas.last')
    })

    it('shows mobile scale labels and updates breakpoint on resize', async () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 })

        const wrapper = mountComponent()

        window.dispatchEvent(new Event('resize'))

        vi.advanceTimersByTime(13500)
        await flushPromises()

        const labels = wrapper.findAll('.label')
        expect(labels[0].text()).toBe('areas.mobileFirst')
        expect(labels[1].text()).toBe('areas.mobileMiddle')
        expect(labels[2].text()).toBe('areas.mobileLast')
    })

    it('removes event listeners on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
        const wrapper = mountComponent()

        wrapper.unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
        expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))
        expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
    })
})