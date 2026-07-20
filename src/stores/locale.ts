import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { messages, type Locale } from '@/i18n/messages'

const STORAGE_KEY = 'site-locale'

function detectLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'zh'
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'zh' || saved === 'en' || saved === 'ja') {
    return saved
  }

  const language = window.navigator.language.toLowerCase()
  if (language.startsWith('ja')) {
    return 'ja'
  }
  if (language.startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>(detectLocale())

  const t = computed(() => messages[locale.value])

  function setLocale(next: Locale) {
    if (next !== 'zh' && next !== 'en' && next !== 'ja') {
      return
    }
    locale.value = next
  }

  watch(
    locale,
    (value) => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = value === 'zh' ? 'zh-CN' : value === 'ja' ? 'ja' : 'en'
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, value)
      }
    },
    { immediate: true },
  )

  return {
    locale,
    t,
    setLocale,
  }
})
