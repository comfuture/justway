// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: false,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
}).append({
  rules: {
    'no-console': 'warn',
    'quotes': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/attributes-order': 'off',
    'vue/require-default-prop': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
