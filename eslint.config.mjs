// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    files: ['**/*.ts', '**/*.vue', 'locales/*.json'],
    ignores: ['node_modules', '*.d.ts'],
    rules: {
      'no-empty': 'off',
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'max-len': 'off',
      'newline-before-return': 'error',
      'lines-around-comment': [
          'error',
          {
              beforeBlockComment: true,
              beforeLineComment: true,
              allowBlockStart: true,
              allowClassStart: true,
              allowObjectStart: true,
              allowArrayStart: true,

              // We don't want to add extra space above closing SECTION
              ignorePattern: '!SECTION',
          },
      ],
      'array-element-newline': ['error', 'consistent'],
      'array-bracket-newline': ['error', 'consistent'],
    }
})
