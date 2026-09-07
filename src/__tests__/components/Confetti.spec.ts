import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Confetti from '../../components/Confetti/Confetti.vue'

vi.mock('../../components/Confetti/styles.module.css', () => {
    const classes = {
        confetti: 'confetti',
        rotate: 'rotate',
        askew: 'askew',
    }
    return {
        ...classes,
        default: classes,
    }
})

describe('Confetti.vue', () => {
    let mockAnimate: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockAnimate = vi.fn().mockImplementation(() => {
            let onfinishHandler: (() => void) | null = null

            const animationObj = {
                set onfinish(cb: (() => void) | null) {
                    onfinishHandler = cb
                },
                get onfinish(): (() => void) | null {
                    return onfinishHandler
                },
            }
            return animationObj as unknown as Animation
        })

        Element.prototype.animate = mockAnimate as unknown as typeof Element.prototype.animate
    })

    it('renders 80 confetti elements', () => {
        const wrapper = mount(Confetti)

        const confettiElements = wrapper.findAll('.confetti')
        expect(confettiElements).toHaveLength(80)

        const firstConfetti = confettiElements[0]
        expect(firstConfetti.find('.rotate').exists()).toBe(true)
        expect(firstConfetti.find('.rotate .askew').exists()).toBe(true)
    })

    it('starts animation burst on mount for all 80 items', () => {
        mount(Confetti)

        expect(mockAnimate).toHaveBeenCalledTimes(80)

        const firstCallKeyframes = mockAnimate.mock.calls[0][0]
        const firstCallOptions = mockAnimate.mock.calls[0][1]

        expect(firstCallKeyframes).toHaveLength(2)
        expect(firstCallKeyframes[0].transform).toContain('translate3d')
        expect(firstCallOptions).toHaveProperty('duration')
        expect(firstCallOptions).toHaveProperty('delay')
        expect(firstCallOptions.fill).toBe('forwards')
    })

    it('hides element when animation finishes', () => {
        const wrapper = mount(Confetti)
        const confettiElements = wrapper.findAll('.confetti')
        const firstEl = confettiElements[0].element as HTMLElement

        expect(firstEl.style.display).toBe('')

        const firstAnimationResult = mockAnimate.mock.results[0].value as unknown as { onfinish: (() => void) | null }

        if (firstAnimationResult.onfinish) {
            firstAnimationResult.onfinish()
        }

        expect(firstEl.style.display).toBe('none')
    })
})
