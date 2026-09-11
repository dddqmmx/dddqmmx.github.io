import type { Locale } from '@/i18n/messages'

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'code'; lang?: string; text: string }
  | { type: 'quote'; text: string }

export type BlogLang = '_jp' | '_chs'

export type BlogIndexPost = {
  id: string
  date: string
  slug: string
  category: Record<BlogLang, string>
  title: Record<BlogLang, string>
  excerpt: Record<BlogLang, string>
  file: Record<BlogLang, string>
}

export type BlogIndex = {
  pageSize: number
  posts: BlogIndexPost[]
}

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

let cachedIndex: BlogIndex | null = null

export function localeToBlogLang(locale: Locale): BlogLang {
  return locale === 'ja' ? '_jp' : '_chs'
}

export const DEFAULT_RAW_BLOG_BASE = 'https://raw.githubusercontent.com/dddqmmx/blog/main'

export function blogUrl(path: string): string {
  const envBase = (import.meta.env.VITE_BLOG_RAW_BASE_URL || import.meta.env.VITE_BLOG_BASE_URL) as
    | string
    | undefined
  const base = envBase?.trim() || DEFAULT_RAW_BLOG_BASE
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}${path.replace(/^\//, '')}`
}

export function clearBlogCache() {
  cachedIndex = null
}

export async function fetchBlogIndex(): Promise<BlogIndex> {
  if (cachedIndex) {
    return cachedIndex
  }
  const response = await fetch(blogUrl('index.json'))
  if (!response.ok) {
    throw new Error(`blog index ${response.status}`)
  }
  const index = (await response.json()) as BlogIndex
  cachedIndex = index
  return index
}

export async function fetchBlogMarkdown(path: string): Promise<string> {
  const response = await fetch(blogUrl(path))
  if (!response.ok) {
    throw new Error(`blog markdown ${response.status}`)
  }
  return response.text()
}

export function sortedIndexPosts(index: BlogIndex): BlogIndexPost[] {
  return [...index.posts].sort((a, b) => b.date.localeCompare(a.date))
}

export function findIndexPost(index: BlogIndex, slug: string): BlogIndexPost | undefined {
  return index.posts.find((post) => post.slug === slug)
}

export function stripInlineMd(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1')
}

export function parseMarkdown(source: string): BlogBlock[] {
  const lines = source.replace(/\r\n/g, '\n').trim().split('\n')
  const blocks: BlogBlock[] = []
  let i = 0

  if (lines[0]?.startsWith('# ')) {
    i = 1
  }

  let para: string[] = []

  const flushPara = () => {
    const text = stripInlineMd(para.join('\n').trim())
    if (text) {
      blocks.push({ type: 'p', text })
    }
    para = []
  }

  while (i < lines.length) {
    const line = lines[i] ?? ''

    if (line.startsWith('```')) {
      flushPara()
      const lang = line.slice(3).trim() || undefined
      const code: string[] = []
      i += 1
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        code.push(lines[i] ?? '')
        i += 1
      }
      blocks.push({ type: 'code', lang, text: code.join('\n') })
      i += 1
      continue
    }

    if (line.startsWith('## ')) {
      flushPara()
      blocks.push({ type: 'h', text: stripInlineMd(line.slice(3).trim()) })
      i += 1
      continue
    }

    if (line.startsWith('>')) {
      flushPara()
      const quote: string[] = []
      while (i < lines.length && (lines[i] ?? '').startsWith('>')) {
        quote.push((lines[i] ?? '').replace(/^>\s?/, ''))
        i += 1
      }
      blocks.push({ type: 'quote', text: stripInlineMd(quote.join('\n')) })
      continue
    }

    if (line === '') {
      flushPara()
      i += 1
      continue
    }

    para.push(line)
    i += 1
  }

  flushPara()
  return blocks
}

export async function loadPost(
  slug: string,
  locale: Locale,
): Promise<{ meta: BlogIndexPost; blocks: BlogBlock[] } | null> {
  const index = await fetchBlogIndex()
  const meta = findIndexPost(index, slug)
  if (!meta) {
    return null
  }
  const markdown = await fetchBlogMarkdown(meta.file[localeToBlogLang(locale)])
  return { meta, blocks: parseMarkdown(markdown) }
}

export function formatStamp(iso: string): { ymd: string; dow: string } {
  const parts = iso.split('-')
  const y = Number(parts[0] ?? 0)
  const m = Number(parts[1] ?? 1)
  const d = Number(parts[2] ?? 1)
  const dow = DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] ?? ''
  return { ymd: `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`, dow }
}
