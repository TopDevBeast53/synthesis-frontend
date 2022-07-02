import { darkColors, lightColors } from '../../theme/colors'
import { PancakeToggleTheme } from './types'

export const light: PancakeToggleTheme = {
    handleBackground: lightColors.backgroundToggle,
    handleShadow: lightColors.textDisabled,
}

export const dark: PancakeToggleTheme = {
    handleBackground: darkColors.backgroundToggle,
    handleShadow: darkColors.textDisabled,
}
