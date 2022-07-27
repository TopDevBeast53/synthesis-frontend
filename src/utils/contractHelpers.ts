import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
    getPancakeProfileAddress,
    getLotteryV2Address,
    getMasterChefAddress,
    getPredictionsAddress,
    getMulticallAddress,
    getHelixAutoPoolAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import masterChef from 'config/abi/masterchef.json'
import predictionsAbi from 'config/abi/predictions.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import helixAutoPoolAbi from 'config/abi/HelixAutoPool.json'
// Types
import {
    Predictions,
    PancakeProfile,
    LotteryV2,
    Masterchef,
    HelixAutoPool,
    Multicall
} from 'config/abi/types'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
}

export const getProfileContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(profileABI, getPancakeProfileAddress(), signer) as PancakeProfile
}
export const getLotteryV2Contract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(lotteryV2Abi, getLotteryV2Address(), signer) as LotteryV2
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