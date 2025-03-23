// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    pnpm: true,
  },
  {
    rules: {
      'no-alert': 'off',
    },
  },
)
