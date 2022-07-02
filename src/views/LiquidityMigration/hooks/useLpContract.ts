import { Contract } from '@ethersproject/contracts'
import lpTokenABI from 'config/abi/lpToken.json'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useCallback, useMemo } from 'react'
import { getProviderOrSigner } from 'utils'
import { isAddress } from 'ethers/lib/utils'
import { helixMigratorAddress } from '../constants'


export const useLpContract = () => {
    const overrides = useMemo(
        () => ({
            gasLimit: 9999999,
        }),
        [],
    )
    const { library, account } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()

    const lpContract = useCallback((lpTokenAddress) => {
        if (isAddress(lpTokenAddress))
            return new Contract(lpTokenAddress, lpTokenABI, getProviderOrSigner(library, account))
        return null
    }, [library, account])

    const approve = useCallback(
        async (lpTokenAddress, amount) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'approve', [helixMigratorAddress, amount], overrides)
            return tx
        },
        [lpContract, callWithGasPrice, overrides],
    )

    const getAllowance = useCallback(
        async (lpTokenAddress) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'allowance', [account, helixMigratorAddress], overrides)
            return tx.toString()
        },
        [lpContract, callWithGasPrice, account, overrides],
    )

    const getBalance = useCallback(
        async (lpTokenAddress) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'balanceOf', [account], overrides)
            return tx.toString()
        },
        [lpContract, callWithGasPrice, account, overrides],
    )

    const getTokenA = useCallback(
        async (lpTokenAddress) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'token0', [], overrides)
            return tx.toString()
        },
        [lpContract, callWithGasPrice, overrides],
    )

    const getTokenB = useCallback(
        async (lpTokenAddress) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'token1', [], overrides)
            return tx.toString()
        },
        [lpContract, callWithGasPrice, overrides],
    )


    return {
        lpContract,
        approve,
        getAllowance,
        getBalance,
        getTokenA,
        getTokenB
    }
}
