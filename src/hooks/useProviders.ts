import { ethers } from 'ethers'
import { useMemo } from 'react'
import useGetChainDetail from 'hooks/useGetChainDetail'

const useProviders = () => {
    const chain = useGetChainDetail()
    const provider = useMemo(() => {
        return new ethers.providers.StaticJsonRpcProvider(chain.rpcUrls[0])
    }, [chain]);

    return provider;
}

export default useProviders;