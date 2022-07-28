import { ChainId } from 'sdk'
import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'
import { VaultKey } from 'state/types'

export const getAddress = (chainId: ChainId, address: Address): string => {
    return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
}

export const getMasterChefAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.masterChef)
}
export const getMulticallAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.multiCall)
}
export const getLotteryV2Address = (chainId: ChainId) => {
    return getAddress(chainId, addresses.lotteryV2)
}
export const getPancakeProfileAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.pancakeProfile)
}
export const getPancakeRabbitsAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.pancakeRabbits)
}
export const getBunnyFactoryAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.bunnyFactory)
}
export const getClaimRefundAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.claimRefund)
}
export const getPointCenterIfoAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.bunnySpecial)
}
export const getEasterNftAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.easterNft)
}

export const getVaultPoolAddress = (chainId: ChainId, vaultKey: VaultKey) => {
    if (!vaultKey) {
        return null
    }
    return getAddress(chainId, addresses[vaultKey])
}

export const getHelixAutoPoolAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.helixAutoPool)
}
export const getIfoPoolAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.ifoPool)
}
export const getPredictionsAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.predictions)
}
export const getChainlinkOracleAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.chainlinkOracle)
}
export const getBunnySpecialCakeVaultAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.bunnySpecialCakeVault)
}
export const getBunnySpecialPredictionAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.bunnySpecialPrediction)
}
export const getBunnySpecialLotteryAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.bunnySpecialLottery)
}
export const getBunnySpecialXmasAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.bunnySpecialXmas)
}
export const getFarmAuctionAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.farmAuction)
}
export const getAnniversaryAchievement = (chainId: ChainId) => {
    return getAddress(chainId, addresses.AnniversaryAchievement)
}
export const getNftMarketAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.nftMarket)
}
export const getNftSaleAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.nftSale)
}
export const getPancakeSquadAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.pancakeSquad)
}
export const getHelixMigratorAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.helixMigrator)
}
export const getHelixNftAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.helixNFT)
}
export const getHelixChefNftAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.helixNFTChef)
}
export const getVotingAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.voting)
}
export const getHelixNftBridgeAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.helixNFTBridge)
}
export const getHelixVaultAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.helixVault)
}
export const getYieldSwapAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.helixYieldSwap)
}
export const getReferralRegisterAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.referralRegister)
}
export const getHelixLPSwapAddress = (chainId: ChainId) => {
    return getAddress(chainId, addresses.helixLPSwap)
}