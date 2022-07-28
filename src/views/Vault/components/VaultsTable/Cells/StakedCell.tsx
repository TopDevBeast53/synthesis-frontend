import React from 'react'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import getTokens from 'config/constants/tokens'
import { usePriceHelixBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { Box, Flex, Text, useMatchBreakpoints } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface StakedCellProps {
  stakedBalance
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 100px;
  }
`

const StakedCell: React.FC<StakedCellProps> = ({ stakedBalance }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const cakePrice = usePriceHelixBusd()
  const { decimals, symbol } = getTokens.helix

  const stakedTokenBalance = getBalanceNumber(stakedBalance, decimals)
  const stakedTokenDollarBalance = getBalanceNumber(stakedBalance.multipliedBy(cakePrice), decimals)
  const labelText = `${symbol} ${t('Staked')}`
  const hasStaked = stakedBalance.gt(0)

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={hasStaked ? 'primary' : 'textDisabled'}
              decimals={hasStaked ? 5 : 1}
              value={stakedTokenBalance}
            />
            {hasStaked ? (
              <Balance
                display="inline"
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                value={stakedTokenDollarBalance}
                unit=" USD"
              />
            ) : (
              <Text mt="4px" fontSize="12px" color="textDisabled">
                0 USD
              </Text>
            )}
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default StakedCell
