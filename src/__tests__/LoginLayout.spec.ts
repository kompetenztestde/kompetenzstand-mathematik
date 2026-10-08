import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { describe, expect, it, vi } from 'vitest'
import LoginLayout from '@/layouts/LoginLayout.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}))

describe('LoginLayout', () => {
  it('identifies the student report in the portal heading', () => {
    sessionStorage.clear()
    const wrapper = mount(LoginLayout, {
      global: {
        plugins: [createPinia(), [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    })
    const heading = wrapper.get('h1')
    expect(heading.text()).toBe('Kompetenzstand-Mathematik: Schülerbericht')
    expect(heading.get('.login-report-type').text()).toBe('Schülerbericht')
    wrapper.unmount()
  })
})
