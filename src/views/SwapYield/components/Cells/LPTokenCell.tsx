import React from 'react'
import { useFarms } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'
import TokenCell from './TokenCell'

const LPTokenCell = (props) => {
    const {lpTokenAddress, balance} = props
    const {data:farms} = useFarms()
    const lpToken = farms.find((item)=>(getAddress(item.lpAddresses) === lpTokenAddress))
    return (
        <TokenCell tokenSymbol={lpToken?.lpSymbol} balance={balance} />
    )
}

export default LPTokenCell