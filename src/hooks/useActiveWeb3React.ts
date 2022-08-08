import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import useProviders from 'hooks/useProviders'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import useGetChainDetail from './useGetChainDetail'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
    const { library, chainId, ...web3React } = useWeb3React()
    const rpcProvider = useProviders()
    const chain = useGetChainDetail();

    return useMemo(() => {
        return { library: (library || rpcProvider), chainId: chainId ?? chain.chainId, ...web3React }
    }, [library, rpcProvider, chainId, chain, web3React])

}

export default useActiveWeb3React
