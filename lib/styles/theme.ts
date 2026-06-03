export const theme = {
  colors: {
    textPrimary: "#1d1d1f",
    textSecondary: "#6e6e73",
    textMuted: "rgba(0, 0, 0, 0.56)",
    textOnDark: "#f5f5f7",
    background: "#ffffff",
    backgroundElevated: "#f5f5f7",
    backgroundDark: "#000000",
    border: "rgba(29, 29, 31, 0.14)",
    borderStrong: "rgba(29, 29, 31, 0.24)",
    appleBlue: "#0071e3",
    linkBlue: "#0066cc",
    focusRing: "rgba(0, 113, 227, 0.2)",
    danger: "#b42318"
  },
  fonts: {
    text: '"SF Pro JP", "SF Pro Text", "SF Pro Icons", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "Helvetica Neue", Helvetica, Arial, sans-serif',
    display:
      '"SF Pro JP", "SF Pro Display", "SF Pro Icons", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  fontSizes: {
    caption: "0.875rem",
    body: "1.0625rem",
    subtitle: "1.3125rem",
    heading: "2.5rem",
    pageTitle: "4rem"
  },
  lineHeights: {
    body: 1.47,
    compact: 1.24,
    heading: 1.1
  },
  letterSpacing: {
    body: "-0.357px",
    tight: "-0.53px",
    normal: "0"
  },
  radii: {
    control: "0.5rem",
    card: "0.5rem",
    pill: "980px"
  },
  shadows: {
    focus: "0 0 0 3px rgba(0, 113, 227, 0.2)",
    card: "rgba(0, 0, 0, 0.08) 0 12px 30px"
  },
  space: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem"
  },
  layout: {
    contentMaxWidth: "1260px",
    heroMaxWidth: "1680px"
  },
  breakpoints: {
    small: "320px",
    medium: "834px",
    large: "1024px"
  }
} as const;

export type AppTheme = typeof theme;
