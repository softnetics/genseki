export function safeJsonParse<T>(value: unknown): T | null {
  try {
    return JSON.parse(value as string) as T
  } catch {
    return null
  }
}
