import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BlogView from '@/views/BlogView.vue'
import { useLocaleStore } from '@/stores/locale'
import * as blogApi from '@/blog/posts'

const mockIndex: blogApi.BlogIndex = {
  pageSize: 10,
  posts: [
    {
      id: 'android-clipboard-realtime-dialog',
      date: '2026-08-12',
      slug: 'android-clipboard-realtime-dialog',
      category: {
        _jp: 'システム',
        _chs: '系统',
      },
      title: {
        _jp: 'Androidでリアルタイムクリップボードアクセス確認ダイアログの実現方法',
        _chs: 'Android 实时剪切板访问确认弹窗的实现方法',
      },
      excerpt: {
        _jp: '日本語概要',
        _chs: '中文概要',
      },
      file: {
        _jp: 'posts/android-clipboard-realtime-dialog_jp.md',
        _chs: 'posts/android-clipboard-realtime-dialog_chs.md',
      },
    },
  ],
}

async function mountBlog() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(BlogView, {
    global: {
      plugins: [pinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
  await flushPromises()
  return { wrapper, store: useLocaleStore() }
}

describe('BlogView', () => {
  beforeEach(() => {
    vi.spyOn(blogApi, 'fetchBlogIndex').mockResolvedValue(mockIndex)
  })

  it('renders the post list localized for the current locale', async () => {
    const { wrapper, store } = await mountBlog()
    store.setLocale('zh')
    await flushPromises()
    expect(wrapper.text()).toContain('博客')
    expect(wrapper.text()).toContain('Android 实时剪切板访问确认弹窗的实现方法')
  })

  it('switches content when the locale changes', async () => {
    const { wrapper, store } = await mountBlog()
    store.setLocale('ja')
    await flushPromises()
    expect(wrapper.text()).toContain(
      'Androidでリアルタイムクリップボードアクセス確認ダイアログの実現方法',
    )
  })

  it('links each post to its detail page', async () => {
    const { wrapper, store } = await mountBlog()
    store.setLocale('zh')
    await flushPromises()
    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]?.props('to')).toBe('/blog/android-clipboard-realtime-dialog')
  })
})
