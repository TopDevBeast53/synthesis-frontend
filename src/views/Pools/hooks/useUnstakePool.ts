import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { parseUnits } from 'ethers/lib/utils'
import { useAppDispatch } from 'state'
import { updateUserBalance } from 'state/actions'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import useFetchUserBalances from 'hooks/useFetchUserBalances'
import { useUpdateUserPendingReward, useUpdateUserStakedBalance } from 'state/pools/hooks'

const sousUnstake = async (sousChefContract: any, amount: string, decimals: number) => {
    const units = parseUnits(amount, decimals)

    const tx = await sousChefContract.withdraw(units.toString())
    const receipt = await tx.wait()
    return receipt.status
}

const sousEmergencyUnstake = async (sousChefContract: any) => {
    const tx = await sousChefContract.emergencyWithdraw()
    const receipt = await tx.wait()
    return receipt.status
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
    const dispatch = useAppDispatch()
    const { account } = useWeb3React()
    const masterChefContract = useMasterchef()
    const sousChefContract = useSousChef(sousId)
    const fetchUserBalances = useFetchUserBalances()
    const updateUserStakedBalance = useUpdateUserStakedBalance(sousId, account)
    const updateUserPendingReward = useUpdateUserPendingReward(sousId, account)

    const handleUnstake = useCallback(
        async (amount: string, decimals: number) => {
            if (sousId === 0) {
                await unstakeFarm(masterChefContract, 0, amount)
            } else if (enableEmergencyWithdraw) {
                await sousEmergencyUnstake(sousChefContract)
            } else {
                await sousUnstake(sousChefContract, amount, decimals)
            }
            dispatch(updateUserStakedBalance)
            dispatch(updateUserBalance(sousId, account, fetchUserBalances))
            dispatch(updateUserPendingReward)
        },
        [sousId, enableEmergencyWithdraw, dispatch, updateUserStakedBalance, account, fetchUserBalances, updateUserPendingReward, masterChefContract, sousChefContract],
    )

    return { onUnstake: handleUnstake }
}

export default useUnstakePool
