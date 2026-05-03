import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue'],
    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['spec', 'script', 'template', 'style'],
        },
      ],
      'vue/no-empty-component-block': 'error',
    }
  },
)
.prepend(
  oxlint.configs["flat/recommended"]
)
