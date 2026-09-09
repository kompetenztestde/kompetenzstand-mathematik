import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import MorphCard from '../../components/MorphCard/MorphCard.vue'

const DummyIcon = defineComponent({
    name: 'DummyIcon',
    render() {
        return h('svg', { class: 'dummy-svg' }, h('path'))
    },
})

describe('MorphCard.vue', () => {
    it('renders the passed icon component with correct attributes', () => {
        const wrapper = mount(MorphCard, {
            props: {
                icon: DummyIcon,
            },
        })

        const iconComponent = wrapper.findComponent(DummyIcon)
        expect(iconComponent.exists()).toBe(true)
        expect(iconComponent.classes()).toContain('morphIcon')
        expect(iconComponent.attributes('viewBox')).toBe('0 0 250 224')
        expect(iconComponent.attributes('width')).toBe('100%')
        expect(iconComponent.attributes('height')).toBe('100%')
        expect(iconComponent.attributes('preserveAspectRatio')).toBe('xMidYMid meet')
    })

    it('adds isActive class on mouseenter and removes it on mouseleave', async () => {
        const wrapper = mount(MorphCard, {
            props: {
                icon: DummyIcon,
            },
        })

        const iconWrapper = wrapper.find('.iconWrapper')
        const iconComponent = wrapper.findComponent(DummyIcon)

        expect(iconComponent.classes()).not.toContain('isActive')

        await iconWrapper.trigger('mouseenter')
        expect(iconComponent.classes()).toContain('isActive')

        await iconWrapper.trigger('mouseleave')
        expect(iconComponent.classes()).not.toContain('isActive')
    })

    it('adds isActive class on touchstart and removes it on touchend', async () => {
        const wrapper = mount(MorphCard, {
            props: {
                icon: DummyIcon,
            },
        })

        const iconWrapper = wrapper.find('.iconWrapper')
        const iconComponent = wrapper.findComponent(DummyIcon)

        await iconWrapper.trigger('touchstart')
        expect(iconComponent.classes()).toContain('isActive')

        await iconWrapper.trigger('touchend')
        expect(iconComponent.classes()).not.toContain('isActive')
    })
})
