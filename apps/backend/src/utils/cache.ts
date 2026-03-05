export class MemoryCache<T> {
  private readonly storage = new Map<string, { value: T; expiresAt: number }>();

  constructor(private readonly ttlMs: number) {}

  get(key: string): T | undefined {
    const found = this.storage.get(key);
    if (!found) return undefined;
    if (Date.now() > found.expiresAt) {
      this.storage.delete(key);
      return undefined;
    }
    return found.value;
  }

  set(key: string, value: T): void {
    this.storage.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }
}
