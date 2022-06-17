import { useState, useEffect } from 'react'
import { usePriceHelixBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { DeserializedPool } from 'state/types'
import { fetchHelixVaultFees, fetchPoolsPublicDataAsync } from 'state/pools'
import { useInitialBlock } from 'state/block/hooks'
import { usePoolsWithVault } from 'state/pools/hooks'
import { FetchStatus } from 'config/constants/types'

const useGetTopPoolsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()

  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [topPools, setTopPools] = useState<DeserializedPool[]>([null, null, null, null, null])
  const initialBlock = useInitialBlock()

  const { pools } = usePoolsWithVault()

  const helixPriceBusd = usePriceHelixBusd()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      setFetchStatus(FetchStatus.Fetching)

      try {
        await dispatch(fetchHelixVaultFees())
        await dispatch(fetchPoolsPublicDataAsync(initialBlock))
        setFetchStatus(FetchStatus.Fetched)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.Failed)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.Idle && initialBlock > 0) {
      fetchPoolsPublicData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topPools, isIntersecting, initialBlock])

  useEffect(() => {
    const getTopPoolsByApr = (activePools: DeserializedPool[]) => {
      const sortedByApr = orderBy(activePools, (pool: DeserializedPool) => pool.apr || 0, 'desc')
      setTopPools(sortedByApr.slice(0, 5))
    }
    if (fetchStatus === FetchStatus.Fetched && !topPools[0]) {
      getTopPoolsByApr(pools)
    }
  }, [setTopPools, pools, fetchStatus, helixPriceBusd, topPools])

  return { topPools }
}

export default useGetTopPoolsByApr
