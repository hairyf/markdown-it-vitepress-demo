import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    server: {
      deps: {
        inline: ['vitest-package-exports'],
      },
    },
  },
})
