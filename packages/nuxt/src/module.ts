import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, installModule, addImports } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'justway',
    configKey: 'justway',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // allow defineModel in vue script
    // _nuxt.hook('vite:extend', (ctx) => {
    //   ctx.config.vue.script.defineModel = true
    //   ctx.nuxt.options.vite.vue.script.defineModel = true
    // })

    // base css
    _nuxt.options.css.push(resolver.resolve('./runtime/css/base.css'))

    // install vueuse
    await installModule('@vueuse/nuxt')

    addImports([
      {
        name: 'useBrowserLocale',
        from: resolver.resolve('runtime/composables/use-browser-locale'),
      },
      {
        name: 'parseDate',
        from: resolver.resolve('runtime/util/date'),
      },
      {
        name: 'formatDate',
        from: resolver.resolve('runtime/util/date'),
      },
      {
        name: 'useRippleEffect',
        from: resolver.resolve('runtime/composables/use-ripple-effect'),
      },
      {
        name: 'useToast',
        from: resolver.resolve('runtime/composables/use-toast'),
      },
      {
        name: 'useKeyboardNavigation',
        from: resolver.resolve('runtime/composables/use-keyboard-navigation'),
      }
    ])

    addComponentsDir({
      path: resolver.resolve('runtime/components'),
      pathPrefix: true,
      watch: true,
    })
  },
})
