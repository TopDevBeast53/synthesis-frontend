import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
    getMulticallAddress,
    getHelixAutoPoolAddress,
} from 'utils/addressHelpers'

// ABI
import MultiCallAbi from 'config/abi/Multicall.json'
import helixAutoPoolAbi from 'config/abi/HelixAutoPool.json'
// Types
import {
    HelixAutoPool,
    Multicall
} from 'config/abi/types'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
}

export const getHelixAutoPoolContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(helixAutoPoolAbi, getHelixAutoPoolAddress(), signer) as HelixAutoPool
}
export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(MultiCallAbi, getMulticallAddress(), signer) as Multicall
}