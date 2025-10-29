export function capitalizeFirst(str: string): string {
  if (!str) return str
  str = String(str).trim()
  if (!str) return str
  return str[0].toLocaleUpperCase() + str.slice(1)
}
