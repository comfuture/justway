import {setupThemeObserver } from './util/color'
import type { JuswayConfig } from './types'

export function defineJuswayConfig(config: JuswayConfig) {
  if (config.watch) {
    setupThemeObserver()
  }
}
