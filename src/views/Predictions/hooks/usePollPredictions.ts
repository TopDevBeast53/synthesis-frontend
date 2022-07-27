import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetClaimStatuses, useGetCurrentEpoch, useGetEarliestEpoch, useGetLedgerData, useGetPredictionData, useGetPredictionsStatus, useGetRoundsData } from 'state/predictions/hooks'
import { fetchClaimableStatuses, fetchLedgerData, fetchMarketData, fetchRounds } from 'state/predictions'
import { PredictionStatus } from 'state/types'
import { range } from 'lodash'

const POLL_TIME_IN_SECONDS = 10

const usePollPredictions = () => {
    const timer = useRef<NodeJS.Timeout>(null)
    const dispatch = useAppDispatch()
    const { account } = useWeb3React()
    const currentEpoch = useGetCurrentEpoch()
    const earliestEpoch = useGetEarliestEpoch()
    const status = useGetPredictionsStatus()
    const getRoundsData = useGetRoundsData()
    const getClaimStatuses = useGetClaimStatuses()
    const getLedgerData = useGetLedgerData()
    const getPredictionData = useGetPredictionData()

    useEffect(() => {
        // Clear old timer
        if (timer.current) {
            clearInterval(timer.current)
        }

        if (status !== PredictionStatus.INITIAL) {
            timer.current = setInterval(async () => {
                const liveCurrentAndRecent = [currentEpoch, currentEpoch - 1, currentEpoch - 2]

                dispatch(fetchRounds({ epochs: liveCurrentAndRecent, getRoundsData }))
                dispatch(fetchMarketData({ getPredictionData }))

                if (account) {
                    const epochRange = range(earliestEpoch, currentEpoch + 1)
                    dispatch(fetchLedgerData({ account, epochs: epochRange, getLedgerData }))
                    dispatch(fetchClaimableStatuses({ account, epochs: epochRange, getClaimStatuses }))
                }
            }, POLL_TIME_IN_SECONDS * 1000)
        }

        return () => {
            if (timer.current) {
                clearInterval(timer.current)
            }
        }
    }, [timer, account, status, currentEpoch, earliestEpoch, dispatch, getRoundsData, getClaimStatuses, getLedgerData, getPredictionData])
}

export default usePollPredictions
