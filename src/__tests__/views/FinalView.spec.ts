import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FinalView from '@/views/FinalView/FinalView.vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('@/services/configService', () => ({
    configJson: {
        exerciseLinks: ['https://example.com/link-1', 'https://example.com/link-2', 'https://example.com/link-3'],
    },
}))

describe('FinalView.vue', () => {
    let windowOpenSpy: any

    beforeEach(() => {
        vi.clearAllMocks()
        windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    })

    afterEach(() => {
        windowOpenSpy.mockRestore()
    })

    const mountComponent = () => {
        return mount(FinalView, {
            global: {
                stubs: {
                    MorphCard: true,
                    MorphIcon1: true,
                    MorphIcon2: true,
                    MorphIcon3: true,
                },
            },
        })
    }

    it('sollte die Überschrift, Beschreibung und 3 Aufgaben-Karten rendern', () => {
        const wrapper = mountComponent()

        expect(wrapper.find('h1').text()).toBe('finalView.title')
        expect(wrapper.find('span').text()).toBe('finalView.text')

        const buttons = wrapper.findAll('button')
        expect(buttons.length).toBe(3)
        expect(buttons[0]?.text()).toContain('Aufgabe 1')
        expect(buttons[1]?.text()).toContain('Aufgabe 2')
        expect(buttons[2]?.text()).toContain('Aufgabe 3')
    })

    it('sollte window.open mit der passenden URL öffnen, wenn eine Karte geklickt wird', async () => {
        const wrapper = mountComponent()
        const buttons = wrapper.findAll('button')

        await buttons[1]?.trigger('click')

        expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com/link-2', '_blank', 'noopener,noreferrer')
    })

    it('sollte window.open nicht aufrufen, wenn für den Index kein Link konfiguriert ist', async () => {
        vi.mocked(await import('@/services/configService')).configJson.exerciseLinks = []

        const wrapper = mountComponent()
        const buttons = wrapper.findAll('button')

        await buttons[0]?.trigger('click')

        expect(windowOpenSpy).not.toHaveBeenCalled()
    })
})
