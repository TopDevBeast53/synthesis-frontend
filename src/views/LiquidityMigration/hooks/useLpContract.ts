import { Contract } from '@ethersproject/contracts'
import lpTokenABI from 'config/abi/lpToken.json'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { isAddress } from 'ethers/lib/utils'
import { getHelixMigratorAddress } from 'utils/addressHelpers'

export const useLpContract = () => {
    const { library, account, chainId } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()

    const lpContract = useCallback((lpTokenAddress) => {
        if (isAddress(lpTokenAddress))
            return new Contract(lpTokenAddress, lpTokenABI, getProviderOrSigner(library, account))
        return null
    }, [library, account])

    const approve = useCallback(
        async (lpTokenAddress, amount) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'approve', [getHelixMigratorAddress(chainId), amount])
            return tx
        },
        [lpContract, callWithGasPrice, chainId],
    )

    const getAllowance = useCallback(
        async (lpTokenAddress) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'allowance', [account, getHelixMigratorAddress(chainId)])
            return tx.toString()
        },
        [lpContract, callWithGasPrice, account, chainId],
    )

    const getBalance = useCallback(
        async (lpTokenAddress) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'balanceOf', [account])
            return tx.toString()
        },
        [lpContract, callWithGasPrice, account],
    )

    const getTokenA = useCallback(
        async (lpTokenAddress) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'token0', [])
            return tx.toString()
        },
        [lpContract, callWithGasPrice],
    )

    const getTokenB = useCallback(
        async (lpTokenAddress) => {
            const tx = await callWithGasPrice(lpContract(lpTokenAddress), 'token1', [])
            return tx.toString()
        },
        [lpContract, callWithGasPrice],
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
