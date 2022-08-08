import { useMemo } from 'react'
import { ChainId } from 'sdk';
import { SUPPORTED_NETWORKS } from '../config/constants/networks'
import { CHAIN_CONFIG } from '../utils/types';

const useGetChainDetail = () => {
    const url = new URL(window.location.href);
    const chainName = url.searchParams.get('chain');
    const chain = useMemo((): CHAIN_CONFIG => {
        const network = Object.keys(SUPPORTED_NETWORKS).find(chainId => SUPPORTED_NETWORKS[chainId].chainName === chainName)

        return SUPPORTED_NETWORKS[network] ?? SUPPORTED_NETWORKS[ChainId.MAINNET];
    }, [chainName]);
    return chain;
}

export default useGetChainDetail
