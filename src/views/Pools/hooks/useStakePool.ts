import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserBalance } from 'state/actions'
import { useUpdateUserStakedBalance } from 'state/pools/hooks'
import { stakeFarm } from 'utils/calls'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import useFetchUserBalances from 'hooks/useFetchUserBalances'
// import getGasPrice from 'utils/getGasPrice'

const options = {
    // gasLimit: DEFAULT_GAS_LIMIT,
}

const sousStake = async (sousChefContract, amount, decimals = 18) => {
    // const gasPrice = await getGasPrice()
    const tx = await sousChefContract.deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(), {
        ...options,
    })
    const receipt = await tx.wait()
    return receipt.status
}

const sousStakeBnb = async (sousChefContract, amount) => {
    // const gasPrice = await getGasPrice()
    const tx = await sousChefContract.deposit(new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(), {
        ...options,
        // gasPrice,
    })
    const receipt = await tx.wait()
    return receipt.status
}

const useStakePool = (sousId: number, isUsingBnb = false) => {
    const dispatch = useAppDispatch()
    const { account } = useWeb3React()
    const masterChefContract = useMasterchef()
    const sousChefContract = useSousChef(sousId)
    const fetchUserBalances = useFetchUserBalances()
    const updateUserStakedBalance = useUpdateUserStakedBalance(sousId, account)

    const handleStake = useCallback(
        async (amount: string, decimals: number) => {
            if (sousId === 0) {
                await stakeFarm(masterChefContract, 0, amount)
            } else if (isUsingBnb) {
                await sousStakeBnb(sousChefContract, amount)
            } else {
                await sousStake(sousChefContract, amount, decimals)
            }
            dispatch(updateUserStakedBalance)
            dispatch(updateUserBalance(sousId, account, fetchUserBalances))
        },
        [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, fetchUserBalances, updateUserStakedBalance],
    )

    return { onStake: handleStake }
}

export default useStakePool
