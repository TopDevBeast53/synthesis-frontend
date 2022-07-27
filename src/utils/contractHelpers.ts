import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
    getMasterChefAddress,
    getPredictionsAddress,
    getMulticallAddress,
    getHelixAutoPoolAddress,
} from 'utils/addressHelpers'

// ABI
import masterChef from 'config/abi/masterchef.json'
import predictionsAbi from 'config/abi/predictions.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import helixAutoPoolAbi from 'config/abi/HelixAutoPool.json'
// Types
import {
    Predictions,
    Masterchef,
    HelixAutoPool,
    Multicall
} from 'config/abi/types'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
}


export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(masterChef, getMasterChefAddress(), signer) as Masterchef
}
export const getHelixAutoPoolContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(helixAutoPoolAbi, getHelixAutoPoolAddress(), signer) as HelixAutoPool
}
export const getPredictionsContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(predictionsAbi, getPredictionsAddress(), signer) as unknown as Predictions
}
export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(MultiCallAbi, getMulticallAddress(), signer) as Multicall
}