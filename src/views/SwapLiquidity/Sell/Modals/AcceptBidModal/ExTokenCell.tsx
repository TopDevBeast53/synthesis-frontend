import React from 'react'
import { useAllTokens } from 'hooks/Tokens'
import { TokenImage } from 'components/TokenImage'
import Balance from 'components/Balance'
import { getBalanceNumber } from 'utils/formatBalance'

const ExTokenCell = (props) => {
  const { exTokenAddress, balance } = props
  const tokens = useAllTokens()
  const exToken = tokens[exTokenAddress]
  const amount = getBalanceNumber(balance, exToken.decimals)

  return (
    <>
      <TokenImage token={exToken} width={32} height={32} style={{ position: 'fixed' }} />
      <Balance color="primary" value={amount} fontSize="18px" decimals={4} ml="50px" />
    </>
  )
}

export default ExTokenCell
