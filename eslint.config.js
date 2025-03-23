// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    pnpm: true,
  },
  {
    rules: {
      'regexp/no-contradiction-with-assertion': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'no-alert': 'off',
    },
  },
)
