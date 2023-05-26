import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/markdown-it',
  ],
  externals: [
    'vitepress',
    '@swc/core',
    '@vue/compiler-core',
    '@vue/compiler-sfc',
    'fs-extra',
    'markdown-it-container',
    'typescript',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  failOnWarn: false,
})
