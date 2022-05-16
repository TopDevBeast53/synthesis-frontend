import React from 'react'
import { useFarms } from 'state/farms/hooks'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { TokenPairImage } from 'components/TokenImage'
import TokenCell from './TokenCell'

const Container = styled.div`
  display: flex;
  justify-content: center;

`
const LPTokenCell = (props) => {
  const { lpTokenAddress, balance } = props
  const { data: farms } = useFarms()
  const lpToken = farms.find((item) => getAddress(item.lpAddresses) === lpTokenAddress)
  const amount = getBalanceNumber(balance)
  return(
    <>
      <Container>
        <TokenPairImage primaryToken={lpToken.token} secondaryToken={lpToken.quoteToken} width={32} height={32} />
        <TokenCell tokenSymbol={lpToken?.lpSymbol} balance={amount} />
      </Container>
    </>
  ) 
}

export default LPTokenCell
