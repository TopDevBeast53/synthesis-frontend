import React from 'react'
import { useFarms } from 'state/farms/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { TokenPairImage } from 'components/TokenImage'

const LPTokenCell = (props) => {
  const { lpTokenAddress, balance } = props
  const { data: farms } = useFarms()
  const lpToken = farms.find((item) => item.lpAddress === lpTokenAddress)
  const amount = getBalanceNumber(balance, lpToken.token.decimals)

  return (
    <>
      <TokenPairImage primaryToken={lpToken?.token} secondaryToken={lpToken?.quoteToken} width={32} height={32} style={{ position: 'fixed' }} />
      <Balance color="primary" value={amount} fontSize="18px" decimals={4} ml="50px" />
    </>
  )
}

export default LPTokenCell