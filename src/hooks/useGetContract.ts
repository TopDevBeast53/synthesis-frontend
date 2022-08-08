import { ethers } from 'ethers'
import { useCallback } from "react"
import useProviders from './useProviders'

const useGetContract = () => {
    const rpcProvider = useProviders()
    return useCallback((abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
        const signerOrProvider = signer ?? rpcProvider
        return new ethers.Contract(address, abi, signerOrProvider)
    }, [rpcProvider])
}

export default useGetContract