import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useGetLotteriesGraphData, useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { FetchStatus } from 'config/constants/types'
import useFetchUnclaimedUserRewards from 'state/lottery/useFetchUnclaimedUserRewards'

const useGetUnclaimedRewards = () => {
    const { account } = useWeb3React()
    const { isTransitioning, currentLotteryId } = useLottery()
    const userLotteryData = useGetUserLotteriesGraphData()
    const lotteriesData = useGetLotteriesGraphData()
    const [unclaimedRewards, setUnclaimedRewards] = useState([])
    const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
    const fetchUnclaimedUserRewards = useFetchUnclaimedUserRewards()

    useEffect(() => {
        // Reset on account change and round transition
        setFetchStatus(FetchStatus.Idle)
    }, [account, isTransitioning])

    const fetchAllRewards = async () => {
        setFetchStatus(FetchStatus.Fetching)
        const unclaimedRewardsResponse = await fetchUnclaimedUserRewards(
            account,
            userLotteryData,
            lotteriesData,
            currentLotteryId,
        )
        setUnclaimedRewards(unclaimedRewardsResponse)
        setFetchStatus(FetchStatus.Fetched)
    }

    return { fetchAllRewards, unclaimedRewards, fetchStatus }
}

export default useGetUnclaimedRewards
