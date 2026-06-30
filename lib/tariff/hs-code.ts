// Dotted display for a CCC號列: 0801.32.10.00-1 (11th digit = check digit).
export function formatCcc(raw: string | null | undefined): string {
  const d = (raw ?? "").replace(/\D/g, "")
  if (d.length === 0) return raw ?? ""
  if (d.length < 4) return d
  const parts = [d.slice(0, 4)]
  if (d.length >= 6) parts.push(d.slice(4, 6))
  if (d.length >= 8) parts.push(d.slice(6, 8))
  if (d.length >= 10) parts.push(d.slice(8, 10))
  let out = parts.join(".")
  if (d.length >= 11) out += `-${d.slice(10, 11)}`
  return out
}
