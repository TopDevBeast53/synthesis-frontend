import React from 'react'
import { useFarms } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import TokenCell from './TokenCell'

const LPTokenCell = (props) => {
    const {lpTokenAddress, balance} = props
    const {data:farms} = useFarms()
    const lpToken = farms.find((item)=>(getAddress(item.lpAddresses) === lpTokenAddress))    
    const amount = getBalanceNumber(balance)    
    return (
        <TokenCell tokenSymbol={lpToken?.lpSymbol} balance={amount} />
    )
}

export default LPTokenCell