import React from 'react'
import { useFarms } from 'state/farms/hooks'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useMatchBreakpoints } from 'uikit'
import { TokenPairImage } from 'components/TokenImage'
import BaseTokenCell from './BaseTokenCell'

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
`
const LPTokenCell = (props) => {
  const { lpTokenAddress, balance } = props
  const { data: farms } = useFarms()
  const lpToken = farms.find((item) => item.lpAddress === lpTokenAddress)
  const amount = getBalanceNumber(balance, lpToken.token.decimals)
  const { isMobile } = useMatchBreakpoints()
  return (
    <>
      <Container>
        {!isMobile && <TokenPairImage primaryToken={lpToken?.token} secondaryToken={lpToken?.quoteToken} width={32} height={32} />}
        <BaseTokenCell tokenSymbol={lpToken?.lpSymbol} balance={amount} />
      </Container>
    </>
  )
}

export default LPTokenCell