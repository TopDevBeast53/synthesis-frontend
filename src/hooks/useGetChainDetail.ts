import { useMemo } from 'react'
import networks from '../config/constants/networks'
import { CHAIN_CONFIG } from '../utils/types';

const useGetChainDetail = () => {
    const url = new URL(window.location.href);
    const chainName = url.searchParams.get('chain');
    const chain = useMemo((): CHAIN_CONFIG => {
        return networks[chainName] ?? networks.ethereum;
    }, [chainName]);
    return chain;
}

export default useGetChainDetail
