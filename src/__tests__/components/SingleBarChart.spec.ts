import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SingleBarChart from '../../components/SingleBarChart/SingleBarChart.vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('../../components/SingleBarChart/styles.module.css', () => {
    const classes = {
        chartContainer: 'chartContainer',
        chartBackgroundWrapper: 'chartBackgroundWrapper',
        waveLayer: 'waveLayer',
        waveDark: 'waveDark',
        waveMedium: 'waveMedium',
        waveLight: 'waveLight',
        areaBorder: 'areaBorder',
        chart: 'chart',
    }
    return {
        ...classes,
        default: classes,
    }
})

const DummyVChart = defineComponent({
    name: 'VueECharts',
    props: ['option', 'initOptions'],
    render() {
        return h('div', { class: 'v-chart-stub' })
    },
})

describe('SingleBarChart.vue', () => {
    const mountComponent = (props: { percentage: number; label?: string; areas?: number[] }) => {
        return mount(SingleBarChart, {
            props,
            global: {
                stubs: {
                    VChart: DummyVChart,
                },
            },
        })
    }

    it('renders correctly with default fallback values for areas', () => {
        const wrapper = mountComponent({ percentage: 75 })

        expect(wrapper.find('.chartContainer').exists()).toBe(true)

        const borders = wrapper.findAll('.areaBorder')
        expect(borders).toHaveLength(2)
        expect(borders[0].attributes('style')).toContain('left: 33%')
        expect(borders[1].attributes('style')).toContain('left: 66%')

        const waveDark = wrapper.find('.waveDark')
        const waveMedium = wrapper.find('.waveMedium')
        const waveLight = wrapper.find('.waveLight')

        expect(waveDark.attributes('style')).toContain('33%')
        expect(waveMedium.attributes('style')).toContain('33%')
        expect(waveMedium.attributes('style')).toContain('66%')
        expect(waveLight.attributes('style')).toContain('66%')
    })

    it('calculates mask gradients and border positions correctly when custom areas are passed', () => {
        const wrapper = mountComponent({
            percentage: 50,
            areas: [20, 80],
        })

        const borders = wrapper.findAll('.areaBorder')
        expect(borders).toHaveLength(2)
        expect(borders[0].attributes('style')).toContain('left: 20%')
        expect(borders[1].attributes('style')).toContain('left: 80%')

        const waveDark = wrapper.find('.waveDark')
        const waveMedium = wrapper.find('.waveMedium')
        const waveLight = wrapper.find('.waveLight')

        expect(waveDark.attributes('style')).toContain('20%')
        expect(waveMedium.attributes('style')).toContain('20%')
        expect(waveMedium.attributes('style')).toContain('80%')
        expect(waveLight.attributes('style')).toContain('80%')
    })

    it('passes the correct chart options with percentage to VChart', () => {
        const testPercentage = 85
        const wrapper = mountComponent({ percentage: testPercentage })

        const chartStub = wrapper.findComponent(DummyVChart)
        expect(chartStub.exists()).toBe(true)

        const option = chartStub.props('option')

        expect(option.renderer).toBe('svg')
        expect(option.animation).toBe(false)
        expect(option.series[0].type).toBe('bar')
        expect(option.series[0].data).toEqual([testPercentage])
    })
})
