import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import { useLocaleStore } from '@/stores/locale'

function mountApp() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  const wrapper = mount(App, {
    global: {
      plugins: [router, pinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
  return { wrapper, store: useLocaleStore() }
}

describe('App language menu', () => {
  it('opens and switches locale via the menu', async () => {
    const { wrapper, store } = mountApp()
    store.setLocale('zh')
    await wrapper.vm.$nextTick()

    await wrapper.get('.languageToggle').trigger('click')
    expect(wrapper.get('.languageToggle').attributes('aria-expanded')).toBe('true')

    await wrapper.get('[data-locale="en"]').trigger('click')
    expect(store.locale).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(window.localStorage.getItem('site-locale')).toBe('en')
    expect(wrapper.get('.languageToggle').attributes('aria-expanded')).toBe('false')

    const text = wrapper.text()
    expect(text).toContain('HOME')
    expect(text).toContain('PROJECT')
    expect(text).toContain('BLOG')
  })

  it('closes the language menu with Escape', async () => {
    const { wrapper } = mountApp()
    await wrapper.get('.languageToggle').trigger('click')
    expect(wrapper.get('.languageToggle').attributes('aria-expanded')).toBe('true')

    await wrapper.get('.languageSelect').trigger('keydown', { key: 'Escape' })
    expect(wrapper.get('.languageToggle').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('#language-menu').element.style.display).toBe('none')
  })

  it('marks the active language option as checked', async () => {
    const { wrapper, store } = mountApp()
    store.setLocale('ja')
    await wrapper.vm.$nextTick()
    await wrapper.get('.languageToggle').trigger('click')

    const ja = wrapper.get('[data-locale="ja"]')
    expect(ja.attributes('aria-checked')).toBe('true')
    const en = wrapper.get('[data-locale="en"]')
    expect(en.attributes('aria-checked')).toBe('false')
  })
})
