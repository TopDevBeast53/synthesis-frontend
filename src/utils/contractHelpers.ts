import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'
import tokens from 'config/constants/tokens'

// Addresses
import {
    getPancakeProfileAddress,
    getLotteryV2Address,
    getMasterChefAddress,
    getPredictionsAddress,
    getMulticallAddress,
    getPancakeSquadAddress,
    getHelixVaultAddress,
    getYieldSwapAddress,
    getHelixLPSwapAddress,
    getHelixChefNftAddress,
    getHelixNftAddress,
    getHelixNftBridgeAddress,
    getHelixAutoPoolAddress,
    getNftSaleAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import masterChef from 'config/abi/masterchef.json'
import predictionsAbi from 'config/abi/predictions.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import pancakeSquadAbi from 'config/abi/pancakeSquad.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'
import helixVaultAbi from 'config/abi/HelixVault.json'
import yieldSwapAbi from 'config/abi/HelixYieldSwap.json'
import lpSwapAbi from 'config/abi/HelixLpSwap.json'
import NFTAbi from 'config/abi/HelixNFT.json'
import cheftNFTAbi from 'config/abi/HelixChefNFT.json'
import bridgeNFTAbi from 'config/abi/HelixNFTBridge.json'
import helixAbi from 'config/abi/Helix.json'
import helixAutoPoolAbi from 'config/abi/HelixAutoPool.json'
import nftSaleAbi from 'config/abi/nftSale.json'
// Types
import {
    Predictions,
    Helix,
    PancakeProfile,
    LotteryV2,
    Masterchef,
    HelixAutoPool,
    Multicall,
    NftSale,
    PancakeSquad,
    Erc721collection,
    HelixVault,
    HelixYieldSwap,
    HelixLpSwap,
    HelixChefNFT,
    HelixNFT,
    HelixNFTBridge
} from 'config/abi/types'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
}

export const getHelixContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(helixAbi, tokens.helix.address, signer) as Helix
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









export const getNftSaleContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(nftSaleAbi, getNftSaleAddress(), signer) as NftSale
}
export const getPancakeSquadContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(pancakeSquadAbi, getPancakeSquadAddress(), signer) as PancakeSquad
}
export const getErc721CollectionContract = (signer?: ethers.Signer | ethers.providers.Provider, address?: string) => {
    return getContract(erc721CollectionAbi, address, signer) as Erc721collection
}
export const getHelixVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(helixVaultAbi, getHelixVaultAddress(), signer) as HelixVault
}
export const getHelixYieldSwapContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(yieldSwapAbi, getYieldSwapAddress(), signer) as HelixYieldSwap
}
export const getHelixLPSwapContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(lpSwapAbi, getHelixLPSwapAddress(), signer) as HelixLpSwap
}

export const getHelixChefNFTContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(cheftNFTAbi, getHelixChefNftAddress(), signer) as HelixChefNFT
} 
export const getHelixNFTContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(NFTAbi, getHelixNftAddress(), signer) as HelixNFT
} 
export const getHelixNFTBridgeContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(bridgeNFTAbi, getHelixNftBridgeAddress(), signer) as HelixNFTBridge
} 