import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import router from '@/router'

const App = defineComponent({
    template: '<router-view />',
})

describe('Router Index', () => {
    beforeEach(async () => {
        router.push('/')
        await router.isReady()
    })

    it('sollte von "/" nach "/step-1" weiterleiten', async () => {
        await router.push('/')
        await router.isReady()

        expect(router.currentRoute.value.path).toBe('/step-1')
        expect(router.currentRoute.value.name).toBe('home')
    })

    it.each([
        { path: '/step-1', expectedName: 'home' },
        { path: '/step-2', expectedName: 'step2' },
        { path: '/step-3', expectedName: 'step3' },
        { path: '/step-7', expectedName: 'step7' },
    ])('sollte die Route $path auflösen und den Namen $expectedName haben', async ({ path, expectedName }) => {
        await router.push(path)
        await router.isReady()

        expect(router.currentRoute.value.path).toBe(path)
        expect(router.currentRoute.value.name).toBe(expectedName)
    })

    it.each([
        { routeName: 'step4', basePath: '/step-4' },
        { routeName: 'step5', basePath: '/step-5' },
        { routeName: 'step6', basePath: '/step-6' },
    ])('sollte die Route $routeName mit und ohne subId-Param aufrufen können', async ({ routeName, basePath }) => {
        await router.push({ name: routeName })
        await router.isReady()
        expect(router.currentRoute.value.path).toBe(basePath)

        await router.push({ name: routeName, params: { subId: '123' } })
        await router.isReady()
        expect(router.currentRoute.value.path).toBe(`${basePath}/123`)
        expect(router.currentRoute.value.params.subId).toBe('123')
    })
})