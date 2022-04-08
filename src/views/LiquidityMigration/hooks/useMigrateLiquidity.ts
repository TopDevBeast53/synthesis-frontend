import { useCallback, useMemo } from 'react';
import { getProviderOrSigner } from 'utils';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers'

import type { ExternalRouterData } from 'config/constants/externalRouters';

import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

import helixMigratorABI from 'config/abi/HelixMigrator.json';
import helixPair from 'config/abi/HelixPair.json';

import { auraMigratorAddress } from '../constants';
import { useSplitPair } from './useSplitPair';

export const useMigrateLiquidity = () => {
    const overrides = useMemo(() => ({
        gasLimit: 9999999
    }), []);

    const { library, account } = useActiveWeb3React();
    const { callWithGasPrice } = useCallWithGasPrice();

    const { splitPair } = useSplitPair();

    const handleMigrateLiquidity: (externalRouter: ExternalRouterData) => Promise<ethers.providers.TransactionReceipt> = useCallback(async (externalRouter) => {
        const [tokenA, tokenB] = await splitPair(externalRouter.pairToken.address);

        const migratorContract = new Contract(auraMigratorAddress, helixMigratorABI, getProviderOrSigner(library, account));
        const lpContract = new Contract(externalRouter.pairToken.address, helixPair, getProviderOrSigner(library, account));

        const approveTx = await callWithGasPrice(lpContract, 'approve', [auraMigratorAddress, ethers.constants.MaxUint256])
        await approveTx.wait()

        const tx = await callWithGasPrice(
            migratorContract, 
            'migrateLiquidity', 
            [tokenA, tokenB, externalRouter.pairToken.address, externalRouter.routerAddress], 
            overrides
        );

        return tx.wait();
    }, [callWithGasPrice, library, account, overrides, splitPair]);

    return { migrateLiquidity: handleMigrateLiquidity };
};
