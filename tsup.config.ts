import { defineConfig } from 'tsup'
import { dependencies, name } from './package.json'

export default defineConfig(() => {
  return {
    external: Object.keys(dependencies || {}),
    entry: ['./src'],
    format: ['esm', 'cjs'],
    clean: true,
    dts: true,
    splitting: false,
    name,
  }
})
