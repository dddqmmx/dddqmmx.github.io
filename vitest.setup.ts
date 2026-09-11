class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
}

const storage = new MemoryStorage()

// The vitest jsdom environment does not copy `localStorage` onto the global
// object (it lives on the jsdom Window prototype), and Node's own experimental
// localStorage is disabled without `--localstorage-file`. Provide a plain
// in-memory implementation so the locale store behaves like a browser.
Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'sessionStorage', {
  value: storage,
  writable: true,
  configurable: true,
})
