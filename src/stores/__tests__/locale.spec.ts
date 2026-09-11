import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const STORAGE_KEY = 'site-locale'

function setBrowserLanguage(languages: string[]) {
  Object.defineProperty(window.navigator, 'languages', {
    value: [...languages],
    configurable: true,
  })
  Object.defineProperty(window.navigator, 'language', {
    value: languages[0] ?? 'en-US',
    configurable: true,
  })
}

describe('locale store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
    document.documentElement.lang = ''
    setBrowserLanguage(['zh-CN'])
  })

  it('detects Chinese from the browser preference list', () => {
    setBrowserLanguage(['zh-CN', 'en'])
    expect(useLocaleStore().locale).toBe('zh')
  })

  it('detects Japanese from the browser preference list', () => {
    setBrowserLanguage(['ja-JP'])
    expect(useLocaleStore().locale).toBe('ja')
  })

  it('falls back to English when the browser prefers neither zh nor ja', () => {
    setBrowserLanguage(['de-DE', 'fr-FR'])
    expect(useLocaleStore().locale).toBe('en')
  })

  it('walks the full ordered preference list before falling back', () => {
    setBrowserLanguage(['fr-FR', 'zh-TW', 'en-US'])
    expect(useLocaleStore().locale).toBe('zh')
  })

  it('prefers a saved choice over the browser language', () => {
    window.localStorage.setItem(STORAGE_KEY, 'ja')
    setBrowserLanguage(['zh-CN'])
    expect(useLocaleStore().locale).toBe('ja')
  })

  it('setLocale updates the locale, persists it, and syncs the document lang', async () => {
    const store = useLocaleStore()
    store.setLocale('en')
    await nextTick()
    expect(store.locale).toBe('en')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('maps zh to the zh-CN document lang', async () => {
    const store = useLocaleStore()
    store.setLocale('zh')
    await nextTick()
    expect(document.documentElement.lang).toBe('zh-CN')
    store.setLocale('ja')
    await nextTick()
    expect(document.documentElement.lang).toBe('ja')
  })

  it('ignores invalid locales', async () => {
    const store = useLocaleStore()
    await nextTick()
    store.setLocale('fr' as never)
    await nextTick()
    expect(store.locale).toBe('zh')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('zh')
  })

  it('exposes the message bundle matching the current locale', () => {
    const store = useLocaleStore()
    store.setLocale('en')
    expect(store.t.nav.home).toBe('HOME')
    store.setLocale('ja')
    expect(store.t.nav.home).toBe('ホーム')
  })
})
