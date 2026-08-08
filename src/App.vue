<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
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

// Tier 2 — top-level pages (routes).
const routeTabs: { to: string; label: () => string }[] = [
  { to: '/', label: () => t.value.nav.home },
  { to: '/projects', label: () => t.value.nav.project },
  { to: '/blog', label: () => t.value.nav.blog },
]

// Tier 3 — in-page anchors of the current page (Home only for now).
const sectionTabs: { id: SectionId; label: () => string }[] = [
  { id: 'home', label: () => t.value.nav.top },
  { id: 'about', label: () => t.value.nav.about },
  { id: 'stack', label: () => t.value.nav.stack },
  { id: 'contact', label: () => t.value.nav.contact },
]

const onHome = computed(() => route.path === '/')

// The Home section submenu (Tier 2) is hidden by default and revealed via this toggle.
const sectionsOpen = ref(false)

function toggleHome(event: Event) {
  event.preventDefault()
  if (onHome.value) {
    sectionsOpen.value = !sectionsOpen.value
  } else {
    // From another page, HOME navigates home; the submenu stays hidden by default.
    void router.push('/')
  }
}

// Reset the submenu to hidden on any navigation so it never lingers open across pages.
watch(
  () => route.path,
  () => {
    sectionsOpen.value = false
  },
)

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

function handleLanguageFocusout(event: FocusEvent) {
  // Close when focus leaves the widget entirely (Tab out, or focus leaving the page).
  if (!languageSelect.value?.contains(event.relatedTarget as Node | null)) {
    languageMenuOpen.value = false
  }
}

function isRouteActive(to: string) {
  // '/' must match exactly; sub-pages also match their nested paths (e.g. /blog/:slug).
  return to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)
}

function isSectionActive(id: SectionId) {
  // Section highlights only apply on the home route; sub-pages own their own highlight.
  return onHome.value && activeSection.value === id
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
    <!-- Tier 1 — top-level page menu + language -->
    <div class="navTier navTierTop">
      <nav class="navPages" :aria-label="t.nav.primary">
        <template v-for="tab in routeTabs" :key="tab.to">
          <button
            v-if="tab.to === '/'"
            type="button"
            class="navPageTab navPageToggle"
            :class="{ active: onHome && sectionsOpen }"
            :aria-current="isRouteActive(tab.to) ? 'page' : undefined"
            aria-haspopup="true"
            aria-controls="section-nav"
            :aria-expanded="onHome && sectionsOpen"
            @click="toggleHome($event)"
          >
            {{ tab.label() }}
          </button>
          <RouterLink
            v-else
            :to="tab.to"
            class="navPageTab"
            :class="{ active: isRouteActive(tab.to) }"
            :aria-current="isRouteActive(tab.to) ? 'page' : undefined"
          >
            {{ tab.label() }}
          </RouterLink>
        </template>
      </nav>

      <div
        ref="languageSelect"
        class="languageSelect"
        @keydown="handleLanguageKeydown"
        @focusout="handleLanguageFocusout"
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
    </div>

    <!-- Tier 2 — in-page section anchors (Home only, toggled open) -->
    <Transition name="submenu">
      <nav
        v-if="onHome && sectionsOpen"
        id="section-nav"
        class="navTier navTierSections"
        aria-label="Section navigation"
      >
        <a
          v-for="section in sectionTabs"
          :key="section.id"
          :href="section.id === 'home' ? '/' : `#${section.id}`"
          :class="{ active: isSectionActive(section.id) }"
          :aria-current="isSectionActive(section.id) ? 'page' : undefined"
          @click="goToSection(section.id, $event)"
        >
          {{ section.label() }}
        </a>
      </nav>
    </Transition>
  </header>

  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.siteNav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  color: #ffffff;
  pointer-events: auto;
}

/* ---------- shared tier row ---------- */
.navTier {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 3vw;
}

/* Tier 1 — top-level page menu + language, pure black */
.navTierTop {
  min-height: var(--nav-tier1-h);
  justify-content: space-between;
  position: relative;
  z-index: 3;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.9) 100%);
  backdrop-filter: blur(6px);
}

/* Top-level page menu (routes), sitting inside Tier 1 */
.navPages {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3.5vw, 3rem);
  min-width: 0;
}

/* Tier 2 — section anchors (Home only), opaque gray bar */
.navTierSections {
  gap: clamp(1rem, 2.6vw, 2.25rem);
  min-height: var(--nav-tier2-h);
  background: var(--color-bg-raise);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* ---------- menu links (both tiers) ---------- */
.navPageTab,
.navTierSections a {
  position: relative;
  flex-shrink: 0;
  font-family: var(--ff-en);
  font-weight: 700;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.82);
  transition: color 0.2s ease;
}

/* The Home tab is a <button>; strip native chrome so it matches the links */
.navPageToggle {
  display: inline-flex;
  align-items: center;
  min-height: var(--nav-tier1-h);
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.navPageTab {
  font-size: clamp(0.95rem, 1.4vw, 1.2rem);
  letter-spacing: 0.1em;
}

.navTierSections a {
  font-size: clamp(0.72rem, 1vw, 0.82rem);
  letter-spacing: 0.12em;
}

.navPageTab:hover,
.navTierSections a:hover {
  color: #ffffff;
}

.navPageToggle:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}

.navPageTab.active,
.navPageTab[aria-current='page'],
.navTierSections a.active,
.navTierSections a[aria-current='page'] {
  color: var(--color-orange-bright);
}

/* ---------- language widget ---------- */
.languageSelect {
  position: relative;
  z-index: 1001;
  flex-shrink: 0;
  font-family: var(--ff-en);
  font-size: clamp(0.9rem, 1.3vw, 1.1rem);
  font-weight: 700;
  letter-spacing: 0.1em;
}

.languageToggle {
  display: flex;
  align-items: center;
  min-height: var(--nav-tier1-h);
  border: 0;
  padding: 0;
  background: transparent;
  color: #ffffff;
  font: inherit;
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
  background: var(--color-bg-raise);
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
  background: var(--color-bg-raise);
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
  color: var(--color-orange-bright);
}

/* ---------- section submenu toggle animation ---------- */
.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
  overflow: hidden;
}

/* Top-pinned nav: submenu slides down from behind the main nav */
.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(calc(-1 * var(--nav-tier1-h)));
}

@media (prefers-reduced-motion: reduce) {
  .submenu-enter-active,
  .submenu-leave-active {
    transition: opacity 0.18s ease;
  }

  .submenu-enter-from,
  .submenu-leave-to {
    transform: none;
  }
}

/* ---------- responsive ---------- */
@media screen and (max-width: 1279px) and (orientation: portrait),
  screen and (max-width: 899px) {
  .siteNav {
    top: auto;
    bottom: 0;
    display: flex;
    flex-direction: column;
  }

  .navTier {
    padding: 0 4vw;
  }

  /* Section submenu sits above the main nav when pinned to the bottom */
  .navTierSections {
    order: 0;
  }

  /* Main nav paints above the submenu so it can occlude it while sliding */
  .navTierTop {
    order: 1;
  }

  /* Page/section menus scroll horizontally on narrow screens */
  .navPages,
  .navTierSections {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .navPages::-webkit-scrollbar,
  .navTierSections::-webkit-scrollbar {
    display: none;
  }

  .navPages {
    margin-right: 1rem;
  }

  .navPageTab {
    font-size: clamp(1rem, 4.5vw, 1.3rem);
    letter-spacing: 0.06em;
  }

  .navTierSections a {
    font-size: clamp(0.9rem, 3.8vw, 1.1rem);
  }

  .navPageToggle {
    min-height: var(--nav-tier1-h);
  }

  .languageToggle {
    min-height: var(--nav-tier1-h);
    padding-left: 0.6rem;
    font-size: clamp(1rem, 4.5vw, 1.3rem);
  }

  /* Anchor the menu relative to the toggle so it opens upward above the
     bottom nav; the nav tier's backdrop-filter would otherwise hijack a
     fixed position and push the menu off-screen. */
  .languageSelect {
    z-index: 1002;
  }

  .languageMenu {
    position: absolute;
    top: auto;
    bottom: 100%;
    right: 0;
  }

  .languageCaret {
    margin-left: 0.5rem;
  }

  /* Bottom-pinned nav: submenu slides up from behind the main nav */
  .submenu-enter-from,
  .submenu-leave-to {
    transform: translateY(var(--nav-tier1-h));
  }
}
</style>

<!-- Route transitions (unscoped: classes land on routed component roots) -->
<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.2s ease;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
</style>
