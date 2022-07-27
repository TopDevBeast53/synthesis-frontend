import { ethers } from 'ethers'
import { useMemo } from 'react'
import useGetChainDetail from 'hooks/useGetChainDetail'

const useProviders = () => {
    const ChainDetail = useGetChainDetail()
    const provider = useMemo(() => {
        return new ethers.providers.StaticJsonRpcProvider(ChainDetail.NODE_URL)
    }, [ChainDetail]);

    return provider;
}

export default useProviders;