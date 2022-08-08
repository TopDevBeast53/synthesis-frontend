import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import useLastUpdated from 'hooks/useLastUpdated'
import { useChainlinkOracleContract } from 'hooks/useContract'

const useGetLatestOraclePrice = () => {
    const [price, setPrice] = useState(ethers.BigNumber.from(0))
    const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
    const contract = useChainlinkOracleContract()

    useEffect(() => {
        const fetchPrice = async () => {
            const response = await contract.latestAnswer()
            setPrice(response)
        }

        fetchPrice()
    }, [contract, lastUpdated, setPrice])

    return { price, lastUpdated, refresh }
}

export default useGetLatestOraclePrice
