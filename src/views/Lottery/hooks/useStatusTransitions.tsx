import { useWeb3React } from '@web3-react/core'
import { LotteryStatus } from 'config/constants/types'
import usePreviousValue from 'hooks/usePreviousValue'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { useGetLotteriesData, useGetUserLotteryData, useLottery } from 'state/lottery/hooks'
import { fetchPublicLotteries, fetchCurrentLotteryId, fetchUserLotteries } from 'state/lottery'
import { useFetchCurrentLotteryIdAndMaxBuy } from 'state/pools/hooks'

const useStatusTransitions = () => {
  const {
    currentLotteryId,
    isTransitioning,
    currentRound: { status },
  } = useLottery()

  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const previousStatus = usePreviousValue(status)
  const fetchCurrentLotteryIdAndMaxBuy = useFetchCurrentLotteryIdAndMaxBuy()
  const getUserLotteryData = useGetUserLotteryData()
  const getLotteriesData = useGetLotteriesData()

  useEffect(() => {
    // Only run if there is a status state change
    if (previousStatus !== status && currentLotteryId) {
      // Current lottery transitions from CLOSE > CLAIMABLE
      if (previousStatus === LotteryStatus.CLOSE && status === LotteryStatus.CLAIMABLE) {
        dispatch(fetchPublicLotteries({ currentLotteryId, getLotteriesData }))
        if (account) {
          dispatch(fetchUserLotteries({ account, currentLotteryId, getUserLotteryData }))
        }
      }
      // Previous lottery to new lottery. From CLAIMABLE (previous round) > OPEN (new round)
      if (previousStatus === LotteryStatus.CLAIMABLE && status === LotteryStatus.OPEN) {
        dispatch(fetchPublicLotteries({ currentLotteryId, getLotteriesData }))
        if (account) {
          dispatch(fetchUserLotteries({ account, currentLotteryId, getUserLotteryData }))
        }
      }
    }
  }, [currentLotteryId, status, previousStatus, account, dispatch, getUserLotteryData, getLotteriesData])

  useEffect(() => {
    // Current lottery is CLAIMABLE and the lottery is transitioning to a NEW round - fetch current lottery ID every 10s.
    // The isTransitioning condition will no longer be true when fetchCurrentLotteryId returns the next lottery ID
    if (previousStatus === LotteryStatus.CLAIMABLE && status === LotteryStatus.CLAIMABLE && isTransitioning) {
      dispatch(fetchCurrentLotteryId({ fetchCurrentLotteryIdAndMaxBuy }))
      dispatch(fetchPublicLotteries({ currentLotteryId, getLotteriesData }))
      const interval = setInterval(async () => {
        dispatch(fetchCurrentLotteryId({ fetchCurrentLotteryIdAndMaxBuy }))
        dispatch(fetchPublicLotteries({ currentLotteryId, getLotteriesData }))
      }, 10000)
      return () => clearInterval(interval)
    }
    return () => null
  }, [status, previousStatus, isTransitioning, currentLotteryId, dispatch, fetchCurrentLotteryIdAndMaxBuy, getLotteriesData])
}

export default useStatusTransitions
