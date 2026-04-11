import { Global, css } from '@emotion/react';

import { colors } from './theme';

const globalStyles = css`
  :root {
    --color-white: ${colors.white};
  }

  * {
    padding: 0;
    margin: 0;
    border: 0;
    font-family: Montserrat, sans-serif;

    &::before,
    &::after {
      box-sizing: border-box;
    }
  }

  :focus,
  :active {
    outline: none;
  }

  a,
  a:visited,
  a:hover {
    text-decoration: none;
  }

  a:focus,
  a:active {
    outline: none;
  }

  nav,
  footer,
  header,
  aside {
    display: block;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    min-height: 100%;
    min-height: 100dvh;
    line-height: 1;
    font-size: 16px;
    text-size-adjust: 100%;
    font-family: Montserrat, sans-serif;
  }

  #root {
    min-height: 100%;
    min-height: 100dvh;
    width: 100%;
  }

  input,
  button,
  textarea {
    font-family: inherit;
    font-size: 16px;
  }

  input::-ms-clear {
    display: none;
  }

  button {
    cursor: pointer;

    &::-moz-focus-inner {
      padding: 0;
      border: 0;
    }
  }

  ul li {
    list-style: none;
  }

  img {
    vertical-align: top;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: 400;
  }
`;

export function GlobalStyles() {
  return <Global styles={globalStyles} />;
}
