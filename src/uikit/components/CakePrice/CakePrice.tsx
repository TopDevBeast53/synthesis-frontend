import React from 'react'
import styled from 'styled-components'
import { mainnetTokens } from 'config/constants/tokens'
import Helix from "../Svg/Icons/Helix";
import Text from '../Text/Text'
import Skeleton from '../Skeleton/Skeleton'
import { Colors } from '../../theme'

export interface Props {
  color?: keyof Colors
  cakePriceUsd?: number
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`

const CakePrice: React.FC<Props> = ({ cakePriceUsd, color = 'textSubtle' }) => {
  const HELIX = mainnetTokens.helix
  return cakePriceUsd ? (
    <PriceLink
      href={`https://helix.finance/swap?outputCurrency=${HELIX.address}`}
      target="_blank"
    >
      <Helix width="24px" mr="8px" />
      <Text color={color} bold>{`$${cakePriceUsd.toFixed(3)}`}</Text>
    </PriceLink>
  ) : (
    <Skeleton width={80} height={24} />
  )
}

export default React.memo(CakePrice)
