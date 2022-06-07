import { useCallback, useMemo } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import helixMigratorABI from 'config/abi/HelixMigrator.json'
import { helixMigratorAddress } from '../constants'

export const useMigrateLiquidity = () => {
    const { library, account } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()

    const handleMigrateLiquidity: (externalRouter: string, lpTokenAddress: string, tokenA: string, tokenB: string) => Promise<ethers.providers.TransactionReceipt> =
        useCallback(
            async (externalRouter, lpTokenAddress, tokenA, tokenB) => {
                const migratorContract = new Contract(
                    helixMigratorAddress,
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
            [callWithGasPrice, library, account],
        )

    return { migrateLiquidity: handleMigrateLiquidity }
}
