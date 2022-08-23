export type ThemeData = {
  backgroundColor: string, // #fff
  surfaceColor?: string,   // dark ? lighten(background, 0.05) Color: darken(background, 0.05)
  primaryColor: string,
  secondaryColor?: string,
  accentColor?: string,
  errorColor?: string,

  borderThickness?: string,
  borderRadius?: string,
}

export type JuswayConfig = {
  theme?: ThemeData,
  watch?: boolean,
}
