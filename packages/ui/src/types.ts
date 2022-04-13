export type Colorspace = 'rgb' | 'rgba' | 'hsl' | 'hsla';
export type PercentValue = `${number}%`

export type ColorSpec = {
  colorspace: Colorspace,
  values: (number | PercentValue)[],
  alpha?: number | PercentValue
}

export type JuswayConfig = {
  theme: {},
  watch: boolean,
}