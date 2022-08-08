import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import helixMigratorABI from 'config/abi/HelixMigrator.json'
import { getHelixMigratorAddress } from 'utils/addressHelpers'

export const useMigrateLiquidity = () => {
    const { library, account, chainId } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()

    const handleMigrateLiquidity: (externalRouter: string, lpTokenAddress: string, tokenA: string, tokenB: string) => Promise<ethers.providers.TransactionReceipt> =
        useCallback(
            async (externalRouter, lpTokenAddress, tokenA, tokenB) => {
                const migratorContract = new Contract(
                    getHelixMigratorAddress(chainId),
                    helixMigratorABI,
                    getProviderOrSigner(library, account),
                )

                const tx = await callWithGasPrice(
                    migratorContract,
                    'migrateLiquidity',
                    [tokenA, tokenB, lpTokenAddress, externalRouter],
                )

                return tx.wait()
            },
            [callWithGasPrice, library, account, chainId],
        )

    return { migrateLiquidity: handleMigrateLiquidity }
}
