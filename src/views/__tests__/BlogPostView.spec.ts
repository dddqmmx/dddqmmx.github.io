import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import BlogPostView from '@/views/BlogPostView.vue'
import { useLocaleStore } from '@/stores/locale'
import * as blogApi from '@/blog/posts'

const mockMeta: blogApi.BlogIndexPost = {
  id: 'android-clipboard-realtime-dialog',
  date: '2026-08-12',
  slug: 'android-clipboard-realtime-dialog',
  category: { _jp: 'システム', _chs: '系统' },
  title: {
    _jp: 'まとめ (JP)',
    _chs: 'Android 实时剪切板访问确认弹窗的实现方法',
  },
  excerpt: { _jp: '日本語概要', _chs: '中文概要' },
  file: {
    _jp: 'posts/android-clipboard-realtime-dialog_jp.md',
    _chs: 'posts/android-clipboard-realtime-dialog_chs.md',
  },
}

async function mountPost(slug: string) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router: Router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/blog/:slug', component: BlogPostView }],
  })
  await router.push(`/blog/${slug}`)
  await router.isReady()
  const wrapper = mount(BlogPostView, {
    global: {
      plugins: [router, pinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
  await flushPromises()
  return { wrapper, store: useLocaleStore() }
}

describe('BlogPostView', () => {
  beforeEach(() => {
    vi.spyOn(blogApi, 'loadPost').mockImplementation(async (slug) => {
      if (slug === 'android-clipboard-realtime-dialog') {
        return {
          meta: mockMeta,
          blocks: [
            { type: 'p', text: '遇到的问题' },
            { type: 'p', text: '解决方案' },
            { type: 'p', text: '总结' },
          ],
        }
      }
      return null
    })
  })

  it('renders the post body in the current locale', async () => {
    const { wrapper, store } = await mountPost('android-clipboard-realtime-dialog')
    store.setLocale('zh')
    await flushPromises()
    expect(wrapper.text()).toContain('遇到的问题')
    expect(wrapper.text()).toContain('解决方案')
    expect(wrapper.text()).toContain('总结')
  })

  it('renders localized titles across locales', async () => {
    const { wrapper, store } = await mountPost('android-clipboard-realtime-dialog')
    store.setLocale('ja')
    await flushPromises()
    expect(wrapper.text()).toContain('まとめ (JP)')
  })

  it('shows the not-found message for an unknown slug', async () => {
    const { wrapper, store } = await mountPost('does-not-exist')
    store.setLocale('zh')
    await flushPromises()
    expect(wrapper.text()).toContain('文章不存在')
  })

  it('links back to the blog index', async () => {
    const { wrapper, store } = await mountPost('android-clipboard-realtime-dialog')
    store.setLocale('zh')
    await flushPromises()
    const back = wrapper
      .findAllComponents(RouterLinkStub)
      .filter((link) => link.props('to') === '/blog')
    expect(back.length).toBeGreaterThan(0)
  })
})
