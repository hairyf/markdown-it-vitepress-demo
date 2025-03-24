import { useData } from 'vitepress'

export function i18n(locales: any) {
  const data = useData()
  return {
    local: data.lang,
    t(key: string): string {
      return locales[data.lang.value][key]
    },
  }
}
