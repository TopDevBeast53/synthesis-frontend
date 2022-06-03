import { Colors } from './types'

export const baseColors = {
    failure: '#ED4B9E',
    primary: '#57E58E',
    primaryBright: '#53DEE9',
    primaryDark: '#0098A1',
    secondary: '#F9FAFA',
    success: '#31D0AA',
    warning: '#FFB237',
    primaryText: '#101411',
}

export const additionalColors = {
    binance: '#F0B90B',
    overlay: '#452a7a',
    gold: '#FFC700',
    silver: '#B2B2B2',
    bronze: '#E7974D',
}

// export const lightColors: Colors = {
//   ...baseColors,
//   ...additionalColors,
//   background: "#090B09",
//   backgroundDisabled: "#E9EAEB",
//   backgroundAlt: "rgba(249, 250, 250, 0.1)",
//   backgroundCard: "red",
//   backgroundAlt2: "rgba(255, 255, 255, 0.7)",
//   cardBorder: "#E7E3EB",
//   contrast: "#191326",
//   dropdown: "#090B09",
//   dropdownDeep: "#EEEEEE",
//   invertedContrast: "#FFFFFF",
//   input: "rgba(249, 250, 250, 0.1)",
//   inputSecondary: "#d7caec",
//   tertiary: "rgba(249, 250, 250, 0.1)",
//   text: "#F9FAFA",
//   textDisabled: "#BDC2C4",
//   textSubtle: "#F9FAFA",
//   disabled: "#E9EAEB",
//   gradients: {
//     bubblegum: "linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)",
//     inverseBubblegum: "linear-gradient(139.73deg, #F3EFFF 0%, #E5FDFF 100%)",
//     cardHeader: "#101411",
//     blue: "linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)",
//     violet: "linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)",
//     violetAlt: "linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)",
//     gold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
//   },
// };

export const darkColors: Colors = {
    ...baseColors,
    ...additionalColors,
    secondary: '#F9FAFA',
    background: '#08060B',
    backgroundDisabled: '#3c3742',
    backgroundAlt: '#27262c',
    backgroundAlt2: 'rgba(39, 38, 44, 0.7)',
    backgroundCard: 'red',
    cardBorder: '#383241',
    contrast: '#FFFFFF',
    dropdown: '#090B09',
    dropdownDeep: '#100C18',
    invertedContrast: '#191326',
    input: 'rgba(249, 250, 250, 0.15)',
    inputSecondary: '#262130',
    primaryDark: '#0098A1',
    tertiary: '#353547',
    text: '#F9FAFA',
    textDisabled: '#666171',
    textSubtle: 'rgba(249, 250, 250, 1)',
    disabled: '#524B63',
    gradients: {
        bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
        inverseBubblegum: 'linear-gradient(139.73deg, #3D2A54 0%, #313D5C 100%)',
        cardHeader: 'linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)',
        blue: 'linear-gradient(180deg, #00707F 0%, #19778C 100%)',
        violet: 'linear-gradient(180deg, #6C4999 0%, #6D4DB2 100%)',
        violetAlt: 'linear-gradient(180deg, #434575 0%, #66578D 100%)',
        gold: 'linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)',
    },
}

export const lightColors = darkColors
