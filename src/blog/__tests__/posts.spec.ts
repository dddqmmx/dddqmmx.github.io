import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  blogUrl,
  clearBlogCache,
  DEFAULT_RAW_BLOG_BASE,
  fetchBlogIndex,
  fetchBlogMarkdown,
  findIndexPost,
  formatStamp,
  localeToBlogLang,
  parseMarkdown,
  sortedIndexPosts,
  stripInlineMd,
  type BlogIndex,
} from '@/blog/posts'

describe('posts utilities', () => {
  it('formatStamp formats the ISO date into ymd and day-of-week', () => {
    expect(formatStamp('2026-08-03')).toEqual({ ymd: '2026.08.03', dow: 'MON' })
    expect(formatStamp('2026-07-20')).toEqual({ ymd: '2026.07.20', dow: 'MON' })
  })

  it('localeToBlogLang correctly maps locales', () => {
    expect(localeToBlogLang('ja')).toBe('_jp')
    expect(localeToBlogLang('zh')).toBe('_chs')
    expect(localeToBlogLang('en')).toBe('_chs')
  })

  it('stripInlineMd removes markdown bold and backticks', () => {
    expect(stripInlineMd('Hello **world** with `code`')).toBe('Hello world with code')
  })

  it('parseMarkdown parses headers, quotes, code, and paragraphs', () => {
    const md = [
      '# Document Title',
      '',
      'Introductory paragraph here.',
      '',
      '## Section Heading',
      '',
      '> Quote line 1',
      '> Quote line 2',
      '',
      '```kotlin',
      'val x = 1',
      '```',
      '',
      'Final paragraph.',
    ].join('\n')

    const blocks = parseMarkdown(md)
    expect(blocks).toEqual([
      { type: 'p', text: 'Introductory paragraph here.' },
      { type: 'h', text: 'Section Heading' },
      { type: 'quote', text: 'Quote line 1\nQuote line 2' },
      { type: 'code', lang: 'kotlin', text: 'val x = 1' },
      { type: 'p', text: 'Final paragraph.' },
    ])
  })

  it('sortedIndexPosts sorts posts newest first', () => {
    const mockIndex: BlogIndex = {
      pageSize: 10,
      posts: [
        {
          id: '1',
          date: '2026-05-01',
          slug: 'post-1',
          category: { _jp: 'CAT', _chs: 'CAT' },
          title: { _jp: 'T1', _chs: 'T1' },
          excerpt: { _jp: 'E1', _chs: 'E1' },
          file: { _jp: 'f1.md', _chs: 'f1.md' },
        },
        {
          id: '2',
          date: '2026-08-01',
          slug: 'post-2',
          category: { _jp: 'CAT', _chs: 'CAT' },
          title: { _jp: 'T2', _chs: 'T2' },
          excerpt: { _jp: 'E2', _chs: 'E2' },
          file: { _jp: 'f2.md', _chs: 'f2.md' },
        },
      ],
    }

    const sorted = sortedIndexPosts(mockIndex)
    expect(sorted[0]?.slug).toBe('post-2')
    expect(sorted[1]?.slug).toBe('post-1')
  })

  it('findIndexPost returns the post with matching slug', () => {
    const mockIndex: BlogIndex = {
      pageSize: 10,
      posts: [
        {
          id: '1',
          date: '2026-05-01',
          slug: 'test-slug',
          category: { _jp: 'CAT', _chs: 'CAT' },
          title: { _jp: 'T1', _chs: 'T1' },
          excerpt: { _jp: 'E1', _chs: 'E1' },
          file: { _jp: 'f1.md', _chs: 'f1.md' },
        },
      ],
    }
    expect(findIndexPost(mockIndex, 'test-slug')?.id).toBe('1')
    expect(findIndexPost(mockIndex, 'nonexistent')).toBeUndefined()
  })

  it('blogUrl constructs correct GitHub raw URL by default', () => {
    expect(blogUrl('index.json')).toBe(`${DEFAULT_RAW_BLOG_BASE}/index.json`)
    expect(blogUrl('/posts/android.md')).toBe(`${DEFAULT_RAW_BLOG_BASE}/posts/android.md`)
  })

  describe('fetchBlogIndex and fetchBlogMarkdown', () => {
    beforeEach(() => {
      clearBlogCache()
      vi.restoreAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('fetches index from raw URL on success', async () => {
      const mockIndex: BlogIndex = {
        pageSize: 10,
        posts: [],
      }
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockIndex,
      } as Response)

      const result = await fetchBlogIndex()
      expect(result).toEqual(mockIndex)
      expect(fetchSpy).toHaveBeenCalledWith(`${DEFAULT_RAW_BLOG_BASE}/index.json`)

      // Test caching
      const cached = await fetchBlogIndex()
      expect(cached).toEqual(mockIndex)
      expect(fetchSpy).toHaveBeenCalledTimes(1)
    })

    it('throws when fetching index fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(fetchBlogIndex()).rejects.toThrow('blog index 404')
    })

    it('fetches markdown from raw URL on success', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        text: async () => '# Remote content',
      } as Response)

      const content = await fetchBlogMarkdown('posts/post.md')
      expect(content).toBe('# Remote content')
      expect(fetchSpy).toHaveBeenCalledWith(`${DEFAULT_RAW_BLOG_BASE}/posts/post.md`)
    })

    it('throws when fetching markdown fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(fetchBlogMarkdown('posts/post.md')).rejects.toThrow('blog markdown 404')
    })
  })
})

