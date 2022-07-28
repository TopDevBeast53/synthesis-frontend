import { useState, useEffect, useMemo } from 'react'
import { ChainId } from 'sdk'
import { useFarms, usePriceHelixBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync, getNonArchivedFarms } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import { orderBy } from 'lodash'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { DeserializedFarm } from 'state/types'
import { FetchStatus } from 'config/constants/types'
import useFetchFarms from 'state/farms/useFetchFarms'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const useGetTopFarmsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()
  const { data: farms } = useFarms()
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [topFarms, setTopFarms] = useState<FarmWithStakedValue[]>([null, null, null, null, null])
  const helixPriceBusd = usePriceHelixBusd()
  const fetchFarms = useFetchFarms()
  const { chainId } = useActiveWeb3React()

  const nonArchivedFarms = useMemo(() => getNonArchivedFarms(chainId), [chainId])

  useEffect(() => {
    const fetchFarmData = async () => {
      setFetchStatus(FetchStatus.Fetching)
      const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0)
      try {
        await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms.map((farm) => farm.pid), fetchFarms, chainId }))
        setFetchStatus(FetchStatus.Fetched)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.Failed)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.Idle) {
      fetchFarmData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topFarms, isIntersecting, fetchFarms, nonArchivedFarms, chainId])

  useEffect(() => {
    const getTopFarmsByApr = (farmsState: DeserializedFarm[]) => {
      const farmsWithPrices = farmsState.filter(
        (farm) =>
          farm.lpTotalInQuoteToken &&
          farm.quoteTokenPriceBusd &&
          farm.pid !== 0 &&
          farm.multiplier &&
          farm.multiplier !== '0X',
      )
      const farmsWithApr: FarmWithStakedValue[] = farmsWithPrices.map((farm) => {
        const totalLiquidity = farm.lpTotalInQuoteToken.times(farm.quoteTokenPriceBusd)
        const { helixRewardsApr, lpRewardsApr } = getFarmApr(
          farm.poolWeight,
          helixPriceBusd,
          totalLiquidity,
          farm.lpAddresses[ChainId.MAINNET],
        )
        return { ...farm, apr: helixRewardsApr, lpRewardsApr }
      })

      const sortedByApr = orderBy(farmsWithApr, (farm) => farm.apr + farm.lpRewardsApr, 'desc')
      setTopFarms(sortedByApr.slice(0, 5))
    }

    if (fetchStatus === FetchStatus.Fetched && !topFarms[0]) {
      getTopFarmsByApr(farms)
    }
  }, [setTopFarms, farms, fetchStatus, helixPriceBusd, topFarms])

  return { topFarms }
}

export default useGetTopFarmsByApr
