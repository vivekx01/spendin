export function parseIfJson<T = any>(value: unknown): T | unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      // Not a valid JSON string — just return the original string
      return value;
    }
  }
  return value; // Already an object, number, boolean, etc.
}
