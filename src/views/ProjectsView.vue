<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { ProjectKey } from '@/i18n/messages'
import { useLocaleStore } from '@/stores/locale'

type ProjectMeta = {
  key: ProjectKey
  name: string
  tags: string[]
  href: string
}

const localeStore = useLocaleStore()
const { t } = storeToRefs(localeStore)

const projectMeta: ProjectMeta[] = [
  {
    key: 'arirang',
    name: 'arirang',
    tags: ['C++', 'Xposed', 'Android'],
    href: 'https://github.com/dddqmmx/arirang',
  },
  {
    key: 'ncmDesktop',
    name: 'ncm-desktop-for-linux',
    tags: ['Rust', 'Linux', 'Desktop'],
    href: 'https://github.com/dddqmmx/ncm-desktop-for-linux',
  },
  {
    key: 'xminecraft',
    name: 'xminecraft',
    tags: ['Rust', 'Proxy', 'Network'],
    href: 'https://github.com/dddqmmx/xminecraft',
  },
  {
    key: 'soVits',
    name: 'so-vits-svc-cover',
    tags: ['Java', 'AI', 'Mirai'],
    href: 'https://github.com/dddqmmx/so-vits-svc-cover',
  },
  {
    key: 'uvr5',
    name: 'uvr5-cli',
    tags: ['Python', 'CLI', 'Audio'],
    href: 'https://github.com/dddqmmx/uvr5-cli',
  },
  {
    key: 'fuckClipboard',
    name: 'FuckClipboard',
    tags: ['Java', 'Xposed', 'Android'],
    href: 'https://github.com/dddqmmx/FuckClipboard',
  },
]

const projects = computed(() =>
  projectMeta.map((project, index) => ({
    ...project,
    monogram: project.name.replace(/[^a-z0-9]/i, '').charAt(0).toUpperCase(),
    ordinal: String(index + 1).padStart(2, '0'),
    role: t.value.project.roles[project.key],
    description: t.value.project.items[project.key],
    primaryTag: project.tags[0],
    otherTags: project.tags.slice(1),
    lead: index === 0,
    wide: index === projectMeta.length - 1,
  })),
)
</script>

<template>
  <main class="projectsPage">
    <header class="projectsHead">
      <p class="sectionLabel">PROJECT</p>
      <div class="projectsHeadText">
        <h1 class="projectsTitle">{{ t.project.title }}</h1>
        <p class="projectsLead">{{ t.project.lead }}</p>
      </div>
    </header>

    <div class="castWrap">
      <div class="castGrid">
        <a
          v-for="project in projects"
          :key="project.name"
          class="castTile"
          :class="{ lead: project.lead, wide: project.wide }"
          :href="project.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="castGhost" aria-hidden="true">{{ project.monogram }}</span>
          <span class="castOrdinal" aria-hidden="true">{{ project.ordinal }}</span>
          <div class="castInfo">
            <h2 class="castName">
              <span class="name1">{{ project.name }}</span>
              <span class="name2">{{ project.role }}</span>
            </h2>
            <p class="castDesc">{{ project.description }}</p>
            <dl class="builtWith">
              <dt>Built with</dt>
              <dd>
                <span class="pb1">{{ project.primaryTag }}</span>
                <span class="pb2">{{ project.otherTags.join(' / ') }}</span>
              </dd>
            </dl>
            <span class="castView">{{ t.project.view }}</span>
          </div>
        </a>
      </div>
    </div>
  </main>
</template>

<style scoped>
.projectsPage {
  min-height: 100svh;
  padding: calc(var(--nav-h-pages) + 6vh) 0 10vh;
  background: var(--color-bg-base);
}

@media screen and (max-width: 1279px) and (orientation: portrait),
  screen and (max-width: 899px) {
  .projectsPage {
    padding: 6vh 0 calc(var(--nav-h-pages) + 10vh);
  }
}

.projectsHead {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: clamp(2rem, 5vw, 4rem);
}

/* Align the label text with the grid column (box still bleeds to the left edge). */
.sectionLabel {
  padding-left: max(3vw, calc((100vw - 1240px) / 2));
}

.projectsHeadText {
  padding: 0 max(3vw, calc((100% - 1240px) / 2));
}

.projectsTitle {
  font-family: var(--ff-an);
  font-size: clamp(2.6rem, 7vw, 5rem);
  line-height: 1;
  letter-spacing: 0.01em;
}

.projectsLead {
  margin-top: 0.9rem;
  max-width: 42rem;
  color: var(--color-f-dim);
  line-height: 1.7;
}

.castWrap {
  width: min(1240px, 94vw);
  margin: 0 auto;
}

/* ---------- CAST GRID ---------- */
.castGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(38vh, auto);
  gap: 3px;
  background: var(--color-line);
  border: 1px solid var(--color-line);
}

.castTile {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 38vh;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  overflow: hidden;
  color: #ffffff;
  background:
    radial-gradient(120% 80% at 80% 0%, rgba(189, 67, 0, 0.28) 0%, rgba(0, 0, 0, 0) 55%),
    linear-gradient(160deg, #1c1a17 0%, #0a0a0a 100%);
  isolation: isolate;
  transition: transform 0.3s ease;
}

.castTile.lead {
  grid-row: span 2;
}

.castTile.wide {
  grid-column: span 2;
}

.castTile::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%);
  z-index: -1;
}

.castGhost {
  position: absolute;
  top: -0.28em;
  right: 0.04em;
  z-index: -1;
  font-family: var(--ff-an);
  font-size: clamp(9rem, 22vw, 20rem);
  line-height: 1;
  color: rgba(255, 255, 255, 0.05);
  transition: color 0.35s ease, transform 0.35s ease;
  pointer-events: none;
}

.castTile.lead .castGhost {
  font-size: clamp(12rem, 26vw, 26rem);
}

.castOrdinal {
  position: absolute;
  top: clamp(1.2rem, 2.5vw, 2rem);
  left: clamp(1.5rem, 3vw, 2.5rem);
  font-family: var(--ff-en);
  font-size: 0.95rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.1em;
  color: var(--color-gold);
}

.castInfo {
  position: relative;
  display: flex;
  flex-direction: column;
}

.castName {
  line-height: 1;
}

.name1 {
  display: block;
  font-family: var(--ff-an);
  font-size: clamp(1.9rem, 3.6vw, 3.2rem);
  line-height: 0.95;
  letter-spacing: 0.01em;
  overflow-wrap: anywhere;
}

.castTile.lead .name1 {
  font-size: clamp(2.4rem, 5vw, 4.2rem);
}

.name2 {
  display: block;
  margin-top: 0.5rem;
  font-size: clamp(0.9rem, 1.4vw, 1.05rem);
  font-weight: var(--fw-bo);
  letter-spacing: 0.02em;
  color: var(--color-f-dim);
}

.castDesc {
  margin-top: 0.9rem;
  max-width: 34rem;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--color-f-faint);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.castTile.lead .castDesc {
  -webkit-line-clamp: 4;
}

.builtWith {
  margin-top: 1.1rem;
  line-height: 1;
}

.builtWith dt {
  font-family: var(--ff-en);
  font-size: 0.75rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-f-faint);
}

.builtWith dd {
  margin-top: 0.5rem;
}

.pb1 {
  display: block;
  font-family: var(--ff-an);
  font-size: clamp(1.15rem, 1.8vw, 1.5rem);
  line-height: 1;
  color: var(--color-gold);
}

.pb2 {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  color: var(--color-f-dim);
}

.castView {
  margin-top: 1.2rem;
  font-family: var(--ff-en);
  font-size: 0.85rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-orange-bright);
  opacity: 0;
  transform: translateY(0.4rem);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.castTile:hover {
  transform: translateY(-4px);
}

.castTile:hover .castGhost {
  color: rgba(215, 185, 55, 0.14);
  transform: translateX(-0.3rem);
}

.castTile:hover .castView {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 900px) {
  .castGrid {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(46vh, auto);
  }

  .castTile.lead {
    grid-row: span 1;
  }

  .castTile.wide {
    grid-column: span 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .castTile,
  .castGhost,
  .castView {
    transition: none;
  }
}
</style>
