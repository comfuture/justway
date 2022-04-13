import { ColorSpec, Colorspace, PercentValue } from '../types';

function parseHexColor(str: string): ColorSpec {
  const [, body] = str.match(/^#([\da-f]+)$/i) || []
  if (!body)
    return

  switch (body.length) {
    case 3:
    case 4:
      const digits = Array.from(body, s => Number.parseInt(s, 16)).map(n => (n << 4) | n)
      return {
        colorspace: 'rgb',
        values: digits.slice(0, 3),
        alpha: body.length === 3
          ? undefined
          : Math.round(digits[3] / 255 * 100) / 100,
      }

    case 6:
    case 8:
      const value = Number.parseInt(body, 16)
      return {
        colorspace: 'rgb',
        values: body.length === 6
          ? [(value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF]
          : [(value >> 24) & 0xFF, (value >> 16) & 0xFF, (value >> 8) & 0xFF],
        alpha: body.length === 6
          ? undefined
          : Math.round((value & 0xFF) / 255 * 100) / 100,
      }
  }
}

function getComponent(str: string, separator: string) {
  str = str.trim()
  if (str === '')
    return

  const l = str.length
  let parenthesis = 0
  for (let i = 0; i < l; i++) {
    switch (str[i]) {
      case '(':
        parenthesis++
        break

      case ')':
        if (--parenthesis < 0)
          return
        break

      case separator:
        if (parenthesis === 0) {
          const component = str.slice(0, i).trim()
          if (component === '')
            return

          return [
            component,
            str.slice(i + 1).trim(),
          ]
        }
    }
  }

  return [
    str,
    '',
  ]
}

function getComponents(str: string, separator?: string, limit?: number) {
  separator = separator ?? ' '
  if (separator.length !== 1)
    return
  limit = limit ?? 10
  const components = []
  let i = 0
  while (str !== '') {
    if (++i > limit)
      return
    const componentPair = getComponent(str, separator)
    if (!componentPair)
      return
    const [component, rest] = componentPair
    components.push(component)
    str = rest
  }
  if (components.length > 0)
    return components
}


function parseCssCommaColorFunction(color: string): ColorSpec {
  const match = color.match(/^(rgba?|hsla?)\((.+)\)$/i)
  if (!match)
    return

  const [, colorspace, componentString] = match
  // With min 3 (rgb) and max 4 (rgba), try to get 5 components
  const components = getComponents(componentString, ',', 5)
  if (components) {
    if ([3, 4].includes(components.length)) {
      return {
        colorspace: colorspace as Colorspace,
        values: components.slice(0, 3),
        alpha: components[3],
      }
    }
  }
}

export class Color implements ColorSpec {
  colorspace: Colorspace
  values: (number | PercentValue)[]
  alpha?: number | PercentValue

  constructor(spec: ColorSpec) {
    this.colorspace = spec.colorspace
    this.values = spec.values
    this.alpha = spec.alpha
  }

  static fromCSSValue(value: string): Color {
    const colorPattern = /^(rgba?|hsla?)\((.+)\)$/i
    const hexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
    if (hexPattern.test(value)) {
      return new Color(parseHexColor(value))
    } else if (colorPattern.test(value)) {
      return new Color(parseHexColor(value))
    }
  }

  toString() {
    if (this.colorspace.startsWith('hsl')) {
      return `${this.colorspace}(${this.values.join(',')})`
    }
    return '#';
  }
}

export function setupThemeObserver() {
  let themeColor = null
  const styleObserver = new MutationObserver((mutations) => {
    const root = document.documentElement;
    const element = mutations[0].target as HTMLElement
    const currentValue = element.style.getPropertyValue('--ui-theme-color');

    if (currentValue !== themeColor) {
      // the variable has changed
      themeColor = currentValue;
      const {values :[h, s, l]} = Color.fromCSSValue(themeColor)
      root.style.setProperty('--ui-theme-color-h', `${h}`);
      root.style.setProperty('--ui-theme-color-s', `${s}%`);
      root.style.setProperty('--ui-theme-color-l', `${l}%`);
    }
  });

  styleObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style'],
  });
}