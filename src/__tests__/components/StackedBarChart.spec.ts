import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StackedBarChart from '../../components/StackedBarChart/StackedBarChart.vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

describe('StackedBarChart.vue', () => {
    const defaultProps = {
        correctAnswers: 5,
        falseAnswers: 3,
        notWorkedOn: 2,
        total: 10,
    }

    const createWrapper = (props = defaultProps) => {
        return mount(StackedBarChart, {
            props,
            global: {
                stubs: {
                    VChart: true,
                },
            },
        })
    }

    it('renders labels and percentage values correctly based on props', () => {
        const wrapper = createWrapper()

        expect(wrapper.text()).toContain('50%')
        expect(wrapper.text()).toContain('30%')
        expect(wrapper.text()).toContain('20%')

        expect(wrapper.text()).toContain('specialView.correct')
        expect(wrapper.text()).toContain('specialView.false')
        expect(wrapper.text()).toContain('specialView.notWorkedOn')
    })

    it('hides elements when values are 0', () => {
        const wrapper = createWrapper({
            correctAnswers: 10,
            falseAnswers: 0,
            notWorkedOn: 0,
            total: 10,
        })

        const valueLabels = wrapper.findAll('.text-label-bold')
        expect(valueLabels).toHaveLength(1)
        expect(valueLabels[0]?.text()).toBe('100%')

        expect(wrapper.text()).toContain('specialView.correct')
        expect(wrapper.text()).not.toContain('specialView.false')
        expect(wrapper.text()).not.toContain('specialView.notWorkedOn')
    })

    it('shows error warning when answers exceed total (isOverLimit)', () => {
        const wrapper = createWrapper({
            correctAnswers: 6,
            falseAnswers: 5,
            notWorkedOn: 0,
            total: 10,
        })

        expect(wrapper.text()).toContain('specialView.warning')
    })

    it('does not show error warning when under or equal to total limit', () => {
        const wrapper = createWrapper(defaultProps)

        expect(wrapper.text()).not.toContain('specialView.warning')
    })

    it('calculates correct width styles for labels', () => {
        const wrapper = createWrapper({
            correctAnswers: 5,
            falseAnswers: 0,
            notWorkedOn: 0,
            total: 10,
        })

        const label = wrapper.find('.text-label')
        expect(label.attributes('style')).toContain('width: 50%')
    })
})
