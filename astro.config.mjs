import { defineConfig } from 'astro/config'
import { defaultLocale, locales } from './src/i18n.ts'

export default defineConfig({
  output: 'static',
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
})
