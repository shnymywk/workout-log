export const theme = {
  colors: {
    textPrimary: "#101816",
    textSecondary: "#55615e",
    textMuted: "#66726f",
    textOnDark: "#ffffff",
    background: "#ffffff",
    backgroundElevated: "#f3f6f5",
    backgroundDark: "#101816",
    border: "rgba(20, 32, 29, 0.1)",
    borderStrong: "rgba(20, 32, 29, 0.18)",
    appleBlue: "#187c70",
    linkBlue: "#187c70",
    focusRing: "rgba(24, 124, 112, 0.16)",
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
    focus: "0 0 0 3px rgba(24, 124, 112, 0.16)",
    card: "rgba(12, 28, 24, 0.05) 0 16px 40px"
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
