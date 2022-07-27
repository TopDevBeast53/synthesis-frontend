import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserBalance } from 'state/actions'
import { harvestFarm } from 'utils/calls'
import { BIG_ZERO } from 'utils/bigNumber'
// import getGasPrice from 'utils/getGasPrice'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import useFetchUserBalances from 'hooks/useFetchUserBalances'
import { useUpdateUserPendingReward } from 'state/pools/hooks'
// import { DEFAULT_GAS_LIMIT } from 'config'

const options = {
    // gasLimit: DEFAULT_GAS_LIMIT,
}

const harvestPool = async (sousChefContract) => {
    // const gasPrice = await getGasPrice()
    const tx = await sousChefContract.deposit('0', { ...options })
    const receipt = await tx.wait()
    return receipt.status
}

const harvestPoolBnb = async (sousChefContract) => {
    // const gasPrice = await getGasPrice()
    const tx = await sousChefContract.deposit({ ...options, value: BIG_ZERO })
    const receipt = await tx.wait()
    return receipt.status
}

const useHarvestPool = (sousId, isUsingBnb = false) => {
    const dispatch = useAppDispatch()
    const { account } = useWeb3React()
    const sousChefContract = useSousChef(sousId)
    const masterChefContract = useMasterchef()
    const fetchUserBalances = useFetchUserBalances()
    const updateUserPendingReward = useUpdateUserPendingReward(sousId, account)

    const handleHarvest = useCallback(async () => {
        if (sousId === 0) {
            await harvestFarm(masterChefContract, 0)
        } else if (isUsingBnb) {
            await harvestPoolBnb(sousChefContract)
        } else {
            await harvestPool(sousChefContract)
        }
        dispatch(updateUserPendingReward)
        dispatch(updateUserBalance(sousId, account, fetchUserBalances))
    }, [sousId, isUsingBnb, dispatch, updateUserPendingReward, account, fetchUserBalances, masterChefContract, sousChefContract])

    return { onReward: handleHarvest }
}

export default useHarvestPool
