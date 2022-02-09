import { useCallback, useMemo } from 'react';
import { getProviderOrSigner } from 'utils';
import { Contract } from '@ethersproject/contracts';

import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

import auraMigratorABI from 'config/abi/AuraMigrator.json';
import { auraMigratorAddress } from '../constants';

export const useMigrateLiquidity = () => {
    const overrides = useMemo(() => ({
        gasLimit: 9999999
    }), []);

    const { library, account } = useActiveWeb3React();
    const { callWithGasPrice } = useCallWithGasPrice();

    const handleMigrateLiquidity = useCallback(async (args) => {
        const contract = new Contract(auraMigratorAddress, auraMigratorABI, getProviderOrSigner(library, account));
        const tx = await callWithGasPrice(contract, 'migrateLiquidity', args, overrides);
        return tx.toString();
    }, [callWithGasPrice, library, account, overrides]);

    return { migrateLiquidity: handleMigrateLiquidity };
};
