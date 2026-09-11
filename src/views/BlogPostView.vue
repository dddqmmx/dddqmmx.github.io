<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLocaleStore } from '@/stores/locale'
import {
  formatStamp,
  loadPost,
  localeToBlogLang,
  type BlogBlock,
  type BlogIndexPost,
} from '@/blog/posts'

const route = useRoute()
const localeStore = useLocaleStore()
const { t, locale } = storeToRefs(localeStore)

const post = ref<BlogIndexPost | null>(null)
const blocks = ref<BlogBlock[]>([])
const loading = ref(true)
const failed = ref(false)
const missing = ref(false)

async function refresh() {
  loading.value = true
  failed.value = false
  missing.value = false
  try {
    const loaded = await loadPost(String(route.params.slug), locale.value)
    if (!loaded) {
      post.value = null
      blocks.value = []
      missing.value = true
      return
    }
    post.value = loaded.meta
    blocks.value = loaded.blocks
  } catch {
    post.value = null
    blocks.value = []
    failed.value = true
  } finally {
    loading.value = false
  }
}

watch([() => route.params.slug, locale], refresh, { immediate: true })

const stamp = computed(() => (post.value ? formatStamp(post.value.date) : null))
const lang = computed(() => localeToBlogLang(locale.value))
</script>

<template>
  <main class="postPage">
    <p v-if="loading" class="blogStatus">{{ t.blog.loading }}</p>

    <article v-else-if="post" class="post">
      <RouterLink class="backLink" to="/blog">{{ t.blog.back }}</RouterLink>

      <header class="postHead">
        <div class="postMeta">
          <span class="dateStamp"
            >{{ stamp!.ymd }}<span class="dow">{{ stamp!.dow }}</span></span
          >
          <span class="catChip">{{ post.category[lang] }}</span>
        </div>
        <h1 class="postTitle">{{ post.title[lang] }}</h1>
        <p class="postExcerpt">{{ post.excerpt[lang] }}</p>
      </header>

      <div class="postBody">
        <template v-for="(block, index) in blocks" :key="index">
          <h2 v-if="block.type === 'h'" class="bHead">{{ block.text }}</h2>
          <blockquote v-else-if="block.type === 'quote'" class="bQuote">{{ block.text }}</blockquote>
          <div v-else-if="block.type === 'code'" class="bCodeWrap">
            <span v-if="block.lang" class="bCodeLang">{{ block.lang }}</span>
            <pre class="bCode"><code>{{ block.text }}</code></pre>
          </div>
          <p v-else class="bText">{{ block.text }}</p>
        </template>
      </div>

      <footer class="postFoot">
        <RouterLink class="backLink" to="/blog">{{ t.blog.back }}</RouterLink>
      </footer>
    </article>

    <div v-else class="missing">
      <h1 class="missingText">{{ failed ? t.blog.loadError : t.blog.notFound }}</h1>
      <RouterLink class="backLink" to="/blog">{{ t.blog.back }}</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.postPage {
  min-height: 100vh;
  padding: calc(var(--nav-h-pages) + 6vh) 0 10vh;
  background: var(--color-bg-panel);
}

@media screen and (max-width: 1279px) and (orientation: portrait),
  screen and (max-width: 899px) {
  .postPage {
    padding: 6vh 0 calc(var(--nav-h-pages) + 10vh);
  }
}

.post,
.missing,
.blogStatus {
  width: min(720px, 90vw);
  margin: 0 auto;
}

.blogStatus {
  color: var(--color-f-dim);
}

.backLink {
  display: inline-block;
  font-family: var(--ff-en);
  font-weight: var(--fw-sb);
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  color: var(--color-f-dim);
  transition: color 0.2s ease;
}

.backLink:hover {
  color: var(--color-gold);
}

.postHead {
  margin: 2rem 0 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-line);
}

.postMeta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.dateStamp {
  font-size: 1rem;
}

.postTitle {
  font-family: var(--ff-an);
  font-size: clamp(2rem, 5.5vw, 3.4rem);
  line-height: 1.08;
  letter-spacing: 0.01em;
}

.postExcerpt {
  margin-top: 1.2rem;
  color: var(--color-f-dim);
  font-size: 1.1rem;
  line-height: 1.7;
}

.postBody {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bText {
  font-size: 1.08rem;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.86);
}

.bHead {
  margin-top: 1rem;
  font-family: var(--ff-en);
  font-size: 1.5rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.02em;
  color: var(--color-gold);
}

.bQuote {
  padding: 0.4rem 0 0.4rem 1.5rem;
  border-left: 3px solid var(--color-orange);
  font-size: 1.2rem;
  line-height: 1.7;
  font-style: italic;
  color: var(--color-f-base);
}

.bCodeWrap {
  display: flex;
  flex-direction: column;
}

.bCodeLang {
  align-self: flex-start;
  padding: 0.15rem 0.7rem;
  background: var(--color-bg-base);
  border: 1px solid var(--color-line);
  border-bottom: 0;
  font-family: var(--ff-en);
  font-size: 0.68rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-gold);
}

.bCode {
  overflow-x: auto;
  padding: 1.25rem 1.4rem;
  background: var(--color-bg-base);
  border: 1px solid var(--color-line);
  border-left: 3px solid var(--color-gold);
  font-family: 'Fira Code', 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
  font-size: 0.88rem;
  line-height: 1.7;
  color: #e8e8e8;
}

.postFoot {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-line);
}

.missing {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
}

.missingText {
  font-family: var(--ff-an);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
}
</style>
