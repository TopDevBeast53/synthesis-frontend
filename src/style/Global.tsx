import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { AuraTheme } from 'uikit/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends AuraTheme {}
}

const GlobalStyle = createGlobalStyle<{theme: AuraTheme, backgroundImageURL?: string}>`
  * {
    font-family: 'Helvetica Neue', sans-serif;
  }
  body {
    background: ${({ theme, backgroundImageURL }) => `${theme.colors.background} url('${backgroundImageURL}')`};
    background-size: 100%;
    background-repeat: no-repeat;
    
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
