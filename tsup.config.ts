import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'
import { defineConfig } from 'tsup'
import { dependencies, name } from './package.json'

export default defineConfig(() => {
  return {
    external: [...Object.keys({ dependencies }), 'eslint'],
    entry: ['src/**/*.ts', 'src/**/*.mjs'],
    format: ['esm'],
    outDir: './dist',
    outExtension() {
      return { js: '.mjs' }
    },
    bundle: true,
    clean: true,
    dts: true,
    splitting: false,
    esbuildPlugins: [esbuildPluginFilePathExtensions()],
    name,
  }
})
