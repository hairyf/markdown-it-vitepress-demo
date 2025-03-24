import { defineConfig } from 'tsup'
import { dependencies, name } from './package.json'

export default defineConfig(() => {
  return {
    external: Object.keys({ dependencies }),
    entry: ['src/**/*.ts', 'src/**/*.js'],
    format: ['esm'],
    clean: true,
    dts: true,
    splitting: false,
    bundle: false,
    name,
  }
})
