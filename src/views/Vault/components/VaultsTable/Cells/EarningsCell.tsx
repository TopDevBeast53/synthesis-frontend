import React from 'react'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import { usePriceHelixBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { Box, Flex, Skeleton, Text, useMatchBreakpoints } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'


interface EarningsCellProps {
  isLoading,
  earnings
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left:32px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const EarningsCell: React.FC<EarningsCellProps> = ({ isLoading, earnings}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  
  const cakePrice = usePriceHelixBusd()    
  const {decimals, symbol} = tokens.helix
  
  const earningTokenBalance = getBalanceNumber(earnings, decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(cakePrice), decimals)  
  const hasEarnings = !isLoading && earnings.gt(0)  
  const labelText = t('%asset% Earned', { asset: symbol })
   
    return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {isLoading ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={hasEarnings ? 'primary' : 'textDisabled'}
                  decimals={hasEarnings ? 5 : 1}
                  value={hasEarnings ? earningTokenBalance : 0}
                />
                {hasEarnings ? (
                  <>
                    {cakePrice.gt(0) && (
                      <Balance
                        display="inline"
                        fontSize="12px"
                        color="textSubtle"
                        decimals={2}
                        prefix="~"
                        value={earningTokenDollarBalance}
                        unit=" USD"
                      />
                    )}
                  </>
                ) : (
                  <Text mt="4px" fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                )}
              </Box>
            </Flex>
        )}

      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
