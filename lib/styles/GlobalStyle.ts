import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.text};
    text-size-adjust: 100%;
  }

  body {
    min-height: 100vh;
    margin: 0;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.text};
    font-size: ${({ theme }) => theme.fontSizes.body};
    font-weight: 400;
    line-height: ${({ theme }) => theme.lineHeights.body};
    letter-spacing: ${({ theme }) => theme.letterSpacing.body};
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
    letter-spacing: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: ${({ theme }) => theme.colors.linkBlue};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  img,
  svg {
    display: block;
    max-width: 100%;
  }

  :focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;
