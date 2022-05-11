import styled from 'styled-components'
import { Text } from 'uikit'

export enum NFTCardTextType {
  generalCaption,
  generalValue,
  cardCaption,
  cardValue,
}

export const NFTCardText = styled(Text)<{ type: NFTCardTextType }>`
  ${({ type }) => {
    switch (type) {
      case NFTCardTextType.generalCaption:
      case NFTCardTextType.cardCaption:
        return 'color: rgba(249,250,250, 0.5)'
      case NFTCardTextType.cardValue:
        return 'color: rgba(249,250,250, 1)'
      case NFTCardTextType.generalValue:
      default:
        return 'color: white'
    }
  }};

  ${({ type }) => {
    switch (type) {
      case NFTCardTextType.generalCaption:
      case NFTCardTextType.cardCaption:
      case NFTCardTextType.cardValue:
        return 'font-size: 18px'
      case NFTCardTextType.generalValue:
      default:
        return 'font-size: 50px'
    }
  }};
`
