import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from 'uikit/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Helvetica Neue', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    background-image: url('/images/SwapBackground.svg');
    background-size: 100%;
    background-repeat: no-repeat;
    
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
