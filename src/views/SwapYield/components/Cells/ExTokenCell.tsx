import React from 'react'
import { useAllTokens } from 'hooks/Tokens'
import TokenCell from './TokenCell'

const ExTokenCell = (props) => {
    const {exTokenAddress, balance} = props
    const tokens = useAllTokens()
    const exToken = tokens[exTokenAddress]
    
    return (
        <TokenCell tokenSymbol={exToken?.symbol} balance={balance} />
    )
}

export default ExTokenCell