import type { ThemeData } from '../types';
import color from 'color';

export function setTheme(theme?: ThemeData) {
  // TODO: calculate remain colors
  const backgroundColor = color(theme?.backgroundColor ?? '#fff');
  const surfaceColor = backgroundColor.isLight()
    ? backgroundColor.darken(0.05)
    : backgroundColor.lighten(0.05);
  // TODO: define root css variables
}

export function addVariant(name, value) {
  const root = globalThis?.document?.documentElement
  root?.style.getPropertyValue('--ui-primary--color')
  root?.style.setProperty('--ui-primary-color', '#eee')
  root?.style.setProperty('--ui-primary-bg', 'darkblue')
}
