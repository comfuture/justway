export function addVariant(name, value) {
  const root = globalThis?.document?.documentElement
  root?.style.setProperty('--ui-primary-color', '#eee')
  root?.style.setProperty('--ui-primary-bg', 'darkblue')
}
