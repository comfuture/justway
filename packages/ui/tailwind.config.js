const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js,css}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addBase, addComponents, addVariant }) => {
      addBase({
        '--ui-theme-color': '#333',
      })
      addComponents({
        '.ui-variants': {
          '--current-color': 'var(--ui-theme-color)',
          '&.primary': {
            '--current-color': 'var(--ui-primary-color)',
          },
          '&.secondary': {
            '--current-color': 'var(--ui-secondary-color)',
          },
          '&.accent': {
            '--current-color': 'var(--ui-accent-color)',
          },
          '&.raised': {
            'box-shadow': 'inset 1px 1px 1px 0 rgb(255 255 255 / 40%), inset -1px -1px 1px 0 rgb(0 0 0 / 15%);'
          },
          '&.elevated': {
            'box-shadow': '2px 2px 2px 0 rgb(0 0 0 / 40%)'
          }
        }
      }),
        addVariant('disabled', ['&:disabled', '&.disabled'])
    }),
  ]
}


// &:not(.text) {
//   @apply shadow-md;
//   &:hover {
//     --tw-shadow-color: var(--current-color);
//     @apply shadow-lg;
//   }
// }
// &.text {
//   text-shadow: 2px 1px 2px alpha(var(--current-color), 0.9);
// }