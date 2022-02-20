import { useState, useEffect, useMemo } from 'react'
import { usePriceAuraBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { VaultKey, DeserializedPool } from 'state/types'
import { fetchAuraVaultFees, fetchPoolsPublicDataAsync } from 'state/pools'
import { useAuraVault, usePools } from 'state/pools/hooks'
import { getAprData } from 'views/Pools/helpers'
import { FetchStatus } from 'config/constants/types'

export function usePoolsWithVault() {
  const { pools: poolsWithoutAutoVault } = usePools()
  const auraVault = useAuraVault()
  // const ifoPool = useIfoPoolVault()
  const pools = useMemo(() => {
    const activePools = poolsWithoutAutoVault.filter((pool) => !pool.isFinished)
    const auraPool = activePools.find((pool) => pool.sousId === 0)
    const auraAutoVault = { ...auraPool, vaultKey: VaultKey.AuraVault }
    // const ifoPoolVault = { ...auraPool, vaultKey: VaultKey.IfoPool }
    const auraAutoVaultWithApr = {
      ...auraAutoVault,
      apr: getAprData(auraAutoVault, auraVault.fees.performanceFeeAsDecimal).apr,
      rawApr: auraPool.apr,
    }
    // const ifoPoolWithApr = {
    //   ...ifoPoolVault,
    //   apr: getAprData(ifoPoolVault, ifoPool.fees.performanceFeeAsDecimal).apr,
    //   rawApr: auraPool.apr,
    // }
    // return [ifoPoolWithApr, auraAutoVaultWithApr, ...poolsWithoutAutoVault]
    return [auraAutoVaultWithApr, ...poolsWithoutAutoVault]
  // }, [poolsWithoutAutoVault, auraVault.fees.performanceFeeAsDecimal, ifoPool.fees.performanceFeeAsDecimal])
}, [poolsWithoutAutoVault, auraVault.fees.performanceFeeAsDecimal])

  return pools
}

const useGetTopPoolsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()

  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [topPools, setTopPools] = useState<DeserializedPool[]>([null, null, null, null, null])

  const pools = usePoolsWithVault()

  const auraPriceBusd = usePriceAuraBusd()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      setFetchStatus(FetchStatus.Fetching)

      try {
        await dispatch(fetchAuraVaultFees())
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
  }, [setTopPools, pools, fetchStatus, auraPriceBusd, topPools])

  return { topPools }
}

export default useGetTopPoolsByApr
