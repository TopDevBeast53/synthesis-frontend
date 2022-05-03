import { useAllTokens } from 'hooks/Tokens'
import React from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import TokenCell from './TokenCell'

const ExTokenCell = (props) => {
    const {exTokenAddress, balance} = props
    const tokens = useAllTokens()
    const exToken = tokens[exTokenAddress]
    const amount = getBalanceNumber(balance)

    return (
        <TokenCell tokenSymbol={exToken?.symbol} balance={amount} />
    )
}

export default ExTokenCell