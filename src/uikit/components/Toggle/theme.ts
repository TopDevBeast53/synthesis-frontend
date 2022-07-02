import { darkColors, lightColors } from '../../theme/colors'

export type ToggleTheme = {
    handleBackground: string
}

export const light: ToggleTheme = {
    handleBackground: lightColors.backgroundToggle,
}

export const dark: ToggleTheme = {
    handleBackground: darkColors.backgroundToggle,
}
