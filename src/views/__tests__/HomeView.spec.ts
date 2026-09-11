import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import HomeView from '@/views/HomeView.vue'
import { useLocaleStore } from '@/stores/locale'

class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = () => []
}

function mountHome() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(HomeView, {
    global: { plugins: [pinia] },
  })
  return { wrapper, store: useLocaleStore() }
}

describe('HomeView', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('renders the hero name', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const { wrapper } = mountHome()
    const text = wrapper.text()
    expect(text).toContain('PAUL')
    expect(text).toContain('PERKEN')
    expect(text).toContain('STEIN')
  })

  it('localizes content based on the locale store', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const { wrapper, store } = mountHome()
    store.setLocale('en')
    await nextTick()
    expect(wrapper.text()).toContain('Software Developer')
    expect(wrapper.text()).toContain('Privacy modules')

    store.setLocale('ja')
    await nextTick()
    expect(wrapper.text()).toContain('ソフトウェア開発者')
    expect(wrapper.text()).toContain('プライバシーモジュール')
  })

  it('renders the contact cards and tech stack', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const { wrapper } = mountHome()
    expect(wrapper.text()).toContain('@dddqmmx')
    expect(wrapper.text()).toContain('dddqmmx@gmail.com')
    expect(wrapper.text()).toContain('Rust')
    expect(wrapper.text()).toContain('Android / Xposed')
  })
})
