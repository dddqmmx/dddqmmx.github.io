<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocaleStore } from '@/stores/locale'
import { formatStamp, sortedPosts } from '@/blog/posts'

const localeStore = useLocaleStore()
const { t, locale } = storeToRefs(localeStore)

const entries = computed(() =>
  sortedPosts().map((post) => ({
    slug: post.slug,
    stamp: formatStamp(post.date),
    category: post.category[locale.value],
    title: post.title[locale.value],
    excerpt: post.excerpt[locale.value],
  })),
)
</script>

<template>
  <main class="blogPage">
    <header class="blogHead">
      <p class="sectionLabel">BLOG</p>
      <div class="blogHeadText">
        <h1 class="blogTitle">{{ t.blog.title }}</h1>
        <p class="blogLead">{{ t.blog.lead }}</p>
      </div>
    </header>

    <ul class="newsList">
      <li v-for="entry in entries" :key="entry.slug" class="newsRow">
        <RouterLink class="newsLink" :to="`/blog/${entry.slug}`">
          <span class="newsMeta">
            <span class="dateStamp"
              >{{ entry.stamp.ymd }}<span class="dow">{{ entry.stamp.dow }}</span></span
            >
            <span class="catChip">{{ entry.category }}</span>
          </span>
          <div class="newsBody">
            <h2 class="newsTitle">{{ entry.title }}</h2>
            <span class="newsExcerpt">{{ entry.excerpt }}</span>
          </div>
          <span class="newsArrow" aria-hidden="true">→</span>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.blogPage {
  min-height: 100svh;
  padding: calc(var(--nav-h-pages) + 6vh) 0 8vh;
  background: var(--color-bg-panel);
}

.blogHead {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: clamp(2rem, 5vw, 4rem);
}

/* Align the label text with the list/heading content column (box still bleeds left). */
.sectionLabel {
  padding-left: max(4vw, calc((100vw - 1120px) / 2));
}

.blogHeadText {
  padding: 0 max(4vw, calc((100% - 1120px) / 2));
}

.blogTitle {
  font-family: var(--ff-an);
  font-size: clamp(2.6rem, 7vw, 5rem);
  line-height: 1;
  letter-spacing: 0.01em;
}

.blogLead {
  margin-top: 0.9rem;
  max-width: 40rem;
  color: var(--color-f-dim);
  line-height: 1.7;
}

.newsList {
  width: min(1120px, 92vw);
  margin: 0 auto;
  border-top: 1px solid var(--color-line);
}

.newsRow {
  border-bottom: 1px solid var(--color-line);
}

.newsLink {
  display: grid;
  grid-template-columns: 12rem 1fr auto;
  align-items: center;
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: clamp(1.5rem, 3vw, 2.25rem) 0.5rem;
  transition: background-color 0.2s ease, padding-left 0.2s ease;
}

.newsLink:hover {
  background: rgba(255, 255, 255, 0.03);
  padding-left: 1.5rem;
}

.newsMeta {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.dateStamp {
  font-size: 1.05rem;
}

.newsBody {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.newsTitle {
  font-size: clamp(1.25rem, 2.4vw, 1.75rem);
  font-weight: var(--fw-bo);
  line-height: 1.3;
}

.newsLink:hover .newsTitle {
  color: var(--color-gold);
}

.newsExcerpt {
  color: var(--color-f-dim);
  font-size: 0.98rem;
  line-height: 1.6;
}

.newsArrow {
  font-family: var(--ff-en);
  font-size: 1.6rem;
  color: var(--color-f-faint);
  transition: transform 0.2s ease, color 0.2s ease;
}

.newsLink:hover .newsArrow {
  color: var(--color-gold);
  transform: translateX(6px);
}

@media (max-width: 760px) {
  .newsLink {
    grid-template-columns: 1fr auto;
    gap: 0.75rem 1rem;
  }

  .newsMeta {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    grid-column: 1 / -1;
  }

  .newsArrow {
    align-self: center;
  }
}
</style>
