<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { localeOptions, type Locale } from '@/i18n/messages'
import { useLocaleStore } from '@/stores/locale'
import { useSectionStore, type SectionId } from '@/stores/section'

const localeStore = useLocaleStore()
const sectionStore = useSectionStore()
const route = useRoute()
const router = useRouter()
const { locale, t } = storeToRefs(localeStore)
const { activeSection } = storeToRefs(sectionStore)
const languageMenuOpen = ref(false)
const languageSelect = ref<HTMLElement | null>(null)
const languageToggle = ref<HTMLButtonElement | null>(null)

const navItems: { id: SectionId; label: () => string }[] = [
  { id: 'home', label: () => t.value.nav.home },
  { id: 'about', label: () => t.value.nav.about },
  { id: 'project', label: () => t.value.nav.project },
  { id: 'stack', label: () => t.value.nav.stack },
  { id: 'contact', label: () => t.value.nav.contact },
]

function setLocale(next: Locale) {
  localeStore.setLocale(next)
  languageMenuOpen.value = false
  languageToggle.value?.focus()
}

function toggleLanguageMenu() {
  languageMenuOpen.value = !languageMenuOpen.value
}

function getLanguageButtons() {
  return Array.from(
    languageSelect.value?.querySelectorAll<HTMLButtonElement>('.languageOption') ?? [],
  )
}

async function openLanguageMenu(focus: 'active' | 'first' | 'last' = 'active') {
  languageMenuOpen.value = true
  await nextTick()

  const buttons = getLanguageButtons()
  const target =
    focus === 'first'
      ? buttons[0]
      : focus === 'last'
        ? buttons.at(-1)
        : buttons.find((button) => button.dataset.locale === locale.value)

  target?.focus()
}

function handleLanguageKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && languageMenuOpen.value) {
    event.preventDefault()
    languageMenuOpen.value = false
    languageToggle.value?.focus()
    return
  }

  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    return
  }

  event.preventDefault()

  if (!languageMenuOpen.value) {
    void openLanguageMenu(event.key === 'ArrowUp' ? 'last' : 'active')
    return
  }

  const buttons = getLanguageButtons()
  const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement)
  const hasFocusedOption = currentIndex >= 0
  let nextIndex = currentIndex

  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = buttons.length - 1
  if (event.key === 'ArrowDown') nextIndex = hasFocusedOption ? (currentIndex + 1) % buttons.length : 0
  if (event.key === 'ArrowUp') {
    nextIndex = hasFocusedOption ? (currentIndex - 1 + buttons.length) % buttons.length : buttons.length - 1
  }

  buttons[nextIndex]?.focus()
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!languageSelect.value?.contains(event.target as Node)) {
    languageMenuOpen.value = false
  }
}

function goToSection(section: SectionId, event: Event) {
  event.preventDefault()

  if (route.path !== '/') {
    void router.push({ path: '/', hash: section === 'home' ? '' : `#${section}` }).then(() => {
      window.dispatchEvent(new CustomEvent<SectionId>('nav-go-to', { detail: section }))
    })
    return
  }

  sectionStore.setActiveSection(section)
  window.dispatchEvent(new CustomEvent<SectionId>('nav-go-to', { detail: section }))
}

onMounted(() => document.addEventListener('pointerdown', handleDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleDocumentPointerDown))
</script>

<template>
  <header class="siteNav">
    <nav class="navLinks" :aria-label="t.nav.home">
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="item.id === 'home' ? '/' : `#${item.id}`"
        :class="{ active: activeSection === item.id }"
        :aria-current="activeSection === item.id ? 'page' : undefined"
        @click="goToSection(item.id, $event)"
      >
        {{ item.label() }}
      </a>
    </nav>

    <div
      ref="languageSelect"
      class="languageSelect"
      @keydown="handleLanguageKeydown"
    >
      <button
        ref="languageToggle"
        type="button"
        class="languageToggle"
        aria-haspopup="menu"
        aria-controls="language-menu"
        :aria-expanded="languageMenuOpen"
        @click="toggleLanguageMenu"
      >
        <span>{{ t.nav.language }}</span>
        <span class="languageCaret" aria-hidden="true"></span>
      </button>

      <div
        v-show="languageMenuOpen"
        id="language-menu"
        class="languageMenu"
        role="menu"
        :aria-label="t.nav.language"
      >
        <button
          v-for="item in localeOptions"
          :key="item.value"
          type="button"
          class="languageOption"
          :class="{ active: locale === item.value }"
          role="menuitemradio"
          :aria-checked="locale === item.value"
          :data-locale="item.value"
          @click="setLocale(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.siteNav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 64px;
  padding: 0 3vw;
  background: #000000;
  color: #ffffff;
  pointer-events: auto;
}

.navLinks {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
}

.navLinks a,
.languageSelect {
  font-size: clamp(1rem, 1.5vw, 1.45rem);
  font-weight: 800;
  letter-spacing: 0.08em;
}

.navLinks a.active,
.navLinks a[aria-current='page'] {
  color: #bd4300;
}

.languageSelect {
  position: relative;
  z-index: 1001;
  flex-shrink: 0;
}

.languageToggle {
  display: flex;
  align-items: center;
  min-height: 64px;
  border: 0;
  padding: 0;
  background: #000000;
  color: #ffffff;
  font: inherit;
  font-weight: 400;
  letter-spacing: 0;
  cursor: pointer;
}

.languageToggle:focus-visible,
.languageOption:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: -3px;
}

.languageCaret {
  width: 0;
  height: 0;
  margin-left: 0.75rem;
  border-top: 0.55em solid currentColor;
  border-right: 0.35em solid transparent;
  border-left: 0.35em solid transparent;
}

.languageMenu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 18rem;
  max-width: calc(100vw - 2rem);
  overflow: hidden;
  border: 1px solid #656565;
  background: #252525;
  box-shadow: 0 10px 28px rgb(0 0 0 / 45%);
}

.languageOption {
  display: block;
  width: 100%;
  min-height: 54px;
  border: 0;
  border-bottom: 1px solid #555555;
  border-radius: 0;
  padding: 0.7rem 1rem;
  background: #252525;
  color: #ffffff;
  font: inherit;
  font-size: 0.9em;
  font-weight: 400;
  letter-spacing: 0;
  text-align: center;
  cursor: pointer;
}

.languageOption:last-child {
  border-bottom: 0;
}

.languageOption:hover,
.languageOption:focus-visible {
  background: #343434;
}

.languageOption.active {
  color: #d94e00;
}

@media screen and (max-width: 1279px) and (orientation: portrait) {
  .siteNav {
    min-height: 56px;
    padding: 0 4vw;
  }

  .navLinks {
    width: calc(100% - 6.75rem);
    gap: clamp(0.75rem, 4vw, 1.5rem);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .navLinks::-webkit-scrollbar {
    display: none;
  }

  .navLinks a,
  .languageSelect {
    font-size: clamp(0.78rem, 3.4vw, 0.95rem);
    letter-spacing: 0.04em;
  }

  .languageToggle {
    min-height: 56px;
  }

  .languageSelect {
    position: absolute;
    top: 0;
    right: 4vw;
    background: #000000;
  }

  .languageMenu {
    position: fixed;
    top: 56px;
    right: 4vw;
  }

  .languageCaret {
    margin-left: 0.5rem;
  }
}
</style>
