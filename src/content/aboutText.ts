/** `{name}` → şirket adı */
export function formatAboutNamePlaceholder(text: string, siteName: string): string {
  return text.replace(/\{name\}/g, siteName)
}
