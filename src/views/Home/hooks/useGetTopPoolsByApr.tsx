import { useState, useEffect, useMemo } from 'react'
import { usePriceHelixBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { VaultKey, DeserializedPool } from 'state/types'
import { fetchHelixVaultFees, fetchPoolsPublicDataAsync } from 'state/pools'
import { useHelixVault, usePools } from 'state/pools/hooks'
import { getAprData } from 'views/Pools/helpers'
import { FetchStatus } from 'config/constants/types'

export function usePoolsWithVault() {
  const { pools: poolsWithoutAutoVault } = usePools()
  const helixAutoPool = useHelixVault()
  // const ifoPool = useIfoPoolVault()
  const pools = useMemo(() => {
    const activePools = poolsWithoutAutoVault.filter((pool) => !pool.isFinished)
    const helixPool = activePools.find((pool) => pool.sousId === 0)
    const helixAutoVault = { ...helixPool, vaultKey: VaultKey.HelixAutoPool }
    // const ifoPoolVault = { ...helixPool, vaultKey: VaultKey.IfoPool }

    const helixAutoVaultWithApr = {
      ...helixAutoVault,
      apr: getAprData(helixAutoVault, helixAutoPool.fees.performanceFeeAsDecimal).apr,
      rawApr: helixPool.apr,
    }
    // const ifoPoolWithApr = {
    //   ...ifoPoolVault,
    //   apr: getAprData(ifoPoolVault, ifoPool.fees.performanceFeeAsDecimal).apr,
    //   rawApr: helixPool.apr,
    // }
    // return [ifoPoolWithApr, helixAutoVaultWithApr, ...poolsWithoutAutoVault]
    return [helixAutoVaultWithApr, ...poolsWithoutAutoVault]
    // }, [poolsWithoutAutoVault, helixAutoPool.fees.performanceFeeAsDecimal, ifoPool.fees.performanceFeeAsDecimal])
  }, [poolsWithoutAutoVault, helixAutoPool.fees.performanceFeeAsDecimal])

  return pools
}

const useGetTopPoolsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()

  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [topPools, setTopPools] = useState<DeserializedPool[]>([null, null, null, null, null])

  const pools = usePoolsWithVault()

  const helixPriceBusd = usePriceHelixBusd()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      setFetchStatus(FetchStatus.Fetching)

      try {
        await dispatch(fetchHelixVaultFees())
        await dispatch(fetchPoolsPublicDataAsync())
        setFetchStatus(FetchStatus.Fetched)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.Failed)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.Idle) {
      fetchPoolsPublicData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topPools, isIntersecting])

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
