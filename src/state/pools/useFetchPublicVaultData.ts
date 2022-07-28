import BigNumber from 'bignumber.js'
import { convertSharesToHelix } from 'views/Pools/helpers'
import helixAutoPoolAbi from 'config/abi/HelixAutoPool.json'
import { getHelixAutoPoolAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { useCallback } from 'react'
import { useMulticallv2 } from 'hooks/useMulticall'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const useFetchPublicVaultData = () => {
    const multicallv2 = useMulticallv2()
    const { chainId } = useActiveWeb3React()
    return useCallback(async () => {
        try {
            const calls = [
                'getPricePerFullShare',
                'totalShares',
                'calculateHarvestHelixRewards',
                'calculateTotalPendingHelixRewards',
            ].map((method) => ({
                address: getHelixAutoPoolAddress(chainId),
                name: method,
            }))

            const [[sharePrice], [shares], [estimatedHelixBountyReward], [totalPendingHelixHarvest]] = await multicallv2(
                helixAutoPoolAbi,
                calls,
            )

            const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
            const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
            const totalHelixInVaultEstimate = convertSharesToHelix(totalSharesAsBigNumber, sharePriceAsBigNumber)
            return {
                totalShares: totalSharesAsBigNumber.toJSON(),
                pricePerFullShare: sharePriceAsBigNumber.toJSON(),
                totalHelixInVault: totalHelixInVaultEstimate.helixAsBigNumber.toJSON(),
                estimatedHelixBountyReward: new BigNumber(estimatedHelixBountyReward.toString()).toJSON(),
                totalPendingHelixHarvest: new BigNumber(totalPendingHelixHarvest.toString()).toJSON(),
            }
        } catch (error) {
            return {
                totalShares: null,
                pricePerFullShare: null,
                totalHelixInVault: null,
                estimatedHelixBountyReward: null,
                totalPendingHelixHarvest: null,
            }
        }
    }, [chainId, multicallv2])
}

export default useFetchPublicVaultData
