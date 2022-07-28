import { useMemo } from 'react'
import { AddressZero } from '@ethersproject/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getAddress, getAnniversaryAchievement, getBunnyFactoryAddress, getBunnySpecialAddress, getBunnySpecialLotteryAddress, getBunnySpecialPredictionAddress, getBunnySpecialXmasAddress, getChainlinkOracleAddress, getClaimRefundAddress, getEasterNftAddress, getFarmAuctionAddress, getHelixAutoPoolAddress, getHelixChefNftAddress, getHelixLPSwapAddress, getHelixNftAddress, getHelixNftBridgeAddress, getHelixVaultAddress, getIfoPoolAddress, getLotteryV2Address, getMasterChefAddress, getMulticallAddress, getNftMarketAddress, getNftSaleAddress, getPancakeProfileAddress, getPancakeRabbitsAddress, getPancakeSquadAddress, getPointCenterIfoAddress, getPredictionsAddress, getYieldSwapAddress } from 'utils/addressHelpers'
import { VaultKey } from 'state/types'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'
import {
    Erc20,
    Erc20Bytes32,
    ChainlinkOracle,
    FarmAuction,
    Predictions,
    AnniversaryAchievement,
    IfoV1,
    IfoV2,
    IfoPool,
    Erc721,
    Helix,
    BunnyFactory,
    PancakeRabbits,
    PancakeProfile,
    LotteryV2,
    Masterchef,
    SousChef,
    SousChefV2,
    BunnySpecial,
    LpToken,
    ClaimRefund,
    EasterNft,
    HelixAutoPool,
    Multicall,
    BunnySpecialPrediction,
    BunnySpecialLottery,
    NftMarket,
    NftSale,
    PancakeSquad,
    Erc721collection,
    PointCenterIfo,
    HelixVault,
    HelixYieldSwap,
    HelixLpSwap,
    HelixChefNFT,
    HelixNFT,
    HelixNFTBridge,
    Weth,
    EnsRegistrar,
    EnsPublicResolver
} from 'config/abi/types'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from 'sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import ERC20_ABI from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import helixAbi from 'config/abi/Helix.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import easterNftAbi from 'config/abi/easterNft.json'
import helixAutoPoolAbi from 'config/abi/HelixAutoPool.json'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import predictionsAbi from 'config/abi/predictions.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import bunnySpecialPredictionAbi from 'config/abi/bunnySpecialPrediction.json'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import bunnySpecialXmasAbi from 'config/abi/bunnySpecialXmas.json'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import anniversaryAchievementAbi from 'config/abi/anniversaryAchievement.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import nftSaleAbi from 'config/abi/nftSale.json'
import pancakeSquadAbi from 'config/abi/pancakeSquad.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'
import helixVaultAbi from 'config/abi/HelixVault.json'
import yieldSwapAbi from 'config/abi/HelixYieldSwap.json'
import lpSwapAbi from 'config/abi/HelixLpSwap.json'
import NFTAbi from 'config/abi/HelixNFT.json'
import cheftNFTAbi from 'config/abi/HelixChefNFT.json'
import bridgeNFTAbi from 'config/abi/HelixNFTBridge.json'
import ENS_PUBLIC_RESOLVER_ABI from '../config/abi/ens-public-resolver.json'
import ENS_ABI from '../config/abi/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../config/abi/erc20'
import WETH_ABI from '../config/abi/weth.json'

import { getProviderOrSigner, isAddress } from '../utils'
import useProviders from './useProviders'
import useGetContract from './useGetContract'
import { useGetTokens } from './useGetTokens'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(ifoV1Abi, address, library.getSigner()) as IfoV1,
        [address, getContract, library])
}

export const useIfoV2Contract = (address: string) => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(ifoV2Abi, address, library.getSigner()) as IfoV2,
        [address, library, getContract])
}

export const useERC20 = (address: string, withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(
        () => getContract(ERC20_ABI, address, withSignerIfPossible ? getProviderOrSigner(library, account) : null) as Erc20,
        [account, address, library, withSignerIfPossible, getContract],
    )
}

export const useLpContract = (address: string, withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(
        () => getContract(lpTokenAbi, address, withSignerIfPossible ? getProviderOrSigner(library, account) : null) as LpToken,
        [account, address, library, withSignerIfPossible, getContract],
    )
}

export const useERC20s = (addressList: string[], withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(
        () => addressList.map((address) => getContract(ERC20_ABI, address, withSignerIfPossible ? getProviderOrSigner(library, account) : null) as Erc20),
        [account, addressList, library, withSignerIfPossible, getContract],
    )
}
/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(erc721Abi, address, library.getSigner()) as Erc721,
        [address, library, getContract])
}

export const useHelix = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    const tokens = useGetTokens()
    return useMemo(() => getContract(helixAbi, tokens.helix.address, library.getSigner()) as Helix,
        [getContract, library, tokens.helix.address])
}

export const useHelixVault = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(helixVaultAbi, getHelixVaultAddress(chainId), library.getSigner()) as HelixVault,
        [chainId, getContract, library])
}

export const useHelixYieldSwap = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(yieldSwapAbi, getYieldSwapAddress(chainId), library.getSigner()) as HelixYieldSwap,
        [chainId, getContract, library])
}

export const useHelixLpSwap = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(lpSwapAbi, getHelixLPSwapAddress(chainId), library.getSigner()) as HelixLpSwap,
        [getContract, library, chainId])
}
export const useHelixNFT = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(NFTAbi, getHelixNftAddress(chainId), library.getSigner()) as HelixNFT,
        [getContract, library, chainId])
}
export const useHelixNFTChef = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(cheftNFTAbi, getHelixChefNftAddress(chainId), library.getSigner()) as HelixChefNFT,
        [getContract, library, chainId])
}
export const useHelixNFTBridge = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bridgeNFTAbi, getHelixNftBridgeAddress(chainId), library.getSigner()) as HelixNFTBridge,
        [getContract, library, chainId])
}
export const useBunnyFactory = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnyFactoryAbi, getBunnyFactoryAddress(chainId), library.getSigner()) as BunnyFactory,
        [library, getContract, chainId])
}

export const usePancakeRabbits = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress(chainId), library.getSigner()) as PancakeRabbits,
        [getContract, library, chainId])
}

export const useProfile = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(profileABI, getPancakeProfileAddress(chainId), library.getSigner()) as PancakeProfile,
        [getContract, library, chainId])
}

export const useLotteryV2Contract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(lotteryV2Abi, getLotteryV2Address(chainId), library.getSigner()) as LotteryV2,
        [library, getContract, chainId])
}

export const useMasterchef = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(masterChef, getMasterChefAddress(chainId), library.getSigner()) as Masterchef,
        [getContract, library, chainId])
}

export const useSousChef = (id) => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => {
        const config = poolsConfig.find((pool) => pool.sousId === id)
        const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
        return getContract(abi, getAddress(chainId, config.contractAddress), library.getSigner()) as SousChef
    }, [chainId, getContract, id, library])
}

export const useSousChefV2 = (id) => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => {
        const config = poolsConfig.find((pool) => pool.sousId === id)
        return getContract(sousChefV2, getAddress(chainId, config.contractAddress), library.getSigner()) as SousChefV2
    }, [getContract, chainId, library, id])
}

export const usePointCenterIfoContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()

    return useMemo(() => getContract(pointCenterIfo, getPointCenterIfoAddress(chainId), library.getSigner()) as PointCenterIfo,
        [getContract, library, chainId])
}

export const useBunnySpecialContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnySpecialAbi, getBunnySpecialAddress(chainId), library.getSigner()) as BunnySpecial,
        [library, getContract, chainId])
}

export const useClaimRefundContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(claimRefundAbi, getClaimRefundAddress(chainId), library.getSigner()) as ClaimRefund,
        [getContract, library, chainId])
}

export const useEasterNftContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(easterNftAbi, getEasterNftAddress(chainId), library.getSigner()) as EasterNft,
        [getContract, library, chainId])
}

export const useVaultPoolContract = (vaultKey: VaultKey): HelixAutoPool | IfoPool => {
    const helixAutoPoolContract = useHelixAutoPoolContract()
    const ifoPoolContract = useIfoPoolContract()
    return useMemo(() => {
        return vaultKey === VaultKey.HelixAutoPool
            ? helixAutoPoolContract
            : ifoPoolContract
    }, [vaultKey, helixAutoPoolContract, ifoPoolContract])
}

export const useHelixAutoPoolContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(helixAutoPoolAbi, getHelixAutoPoolAddress(chainId), library.getSigner()) as HelixAutoPool,
        [getContract, library, chainId])
}

export const useCakeVaultContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(helixAutoPoolAbi, getHelixAutoPoolAddress(chainId), library.getSigner()) as HelixAutoPool,
        [getContract, library, chainId])
}

export const useIfoPoolContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(ifoPoolAbi, getIfoPoolAddress(chainId), library.getSigner()) as IfoPool,
        [getContract, library, chainId])
}

export const usePredictionsContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(predictionsAbi, getPredictionsAddress(chainId), library.getSigner()) as Predictions,
        [getContract, library, chainId])
}

export const useChainlinkOracleContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(chainlinkOracleAbi, getChainlinkOracleAddress(chainId), library.getSigner()) as ChainlinkOracle,
        [getContract, library, chainId])
}

export const useSpecialBunnyPredictionContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnySpecialPredictionAbi, getBunnySpecialPredictionAddress(chainId), library.getSigner()) as BunnySpecialPrediction,
        [getContract, library, chainId])
}

export const useBunnySpecialLotteryContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnySpecialLotteryAbi, getBunnySpecialLotteryAddress(chainId), library.getSigner()) as BunnySpecialLottery,
        [getContract, library, chainId])
}

export const useBunnySpecialXmasContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnySpecialXmasAbi, getBunnySpecialXmasAddress(chainId), library.getSigner()),
        [getContract, library, chainId])
}

export const useAnniversaryAchievementContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(anniversaryAchievementAbi, getAnniversaryAchievement(chainId), library.getSigner()) as AnniversaryAchievement,
        [getContract, library, chainId])
}

export const useNftSaleContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(nftSaleAbi, getNftSaleAddress(chainId), library.getSigner()) as NftSale,
        [getContract, library, chainId])
}

export const usePancakeSquadContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(pancakeSquadAbi, getPancakeSquadAddress(chainId), library.getSigner()) as PancakeSquad,
        [getContract, library, chainId])
}

export const useFarmAuctionContract = () => {
    const { account, library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    // This hook is slightly different from others
    // Calls were failing if unconnected user goes to farm auction page
    // Using library instead of library.getSigner() fixes the problem for unconnected users
    // However, this fix is not ideal, it currently has following behavior:
    // - If you visit Farm Auction page coming from some other page there are no errors in console (unconnected or connected)
    // - If you go directly to Farm Auction page
    //   - as unconnected user you don't see any console errors
    //   - as connected user you see `unknown account #0 (operation="getAddress", code=UNSUPPORTED_OPERATION, ...` errors
    //     the functionality of the page is not affected, data is loading fine and you can interact with the contract
    //
    // Similar behavior was also noticed on Trading Competition page.
    return useMemo(() => getContract(farmAuctionAbi, getFarmAuctionAddress(chainId), account ? library.getSigner() : library) as FarmAuction,
        [getContract, account, library, chainId])
}

export const useNftMarketContract = () => {
    const { library, chainId } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(nftMarketAbi, getNftMarketAddress(chainId), library.getSigner()) as NftMarket,
        [getContract, library, chainId])
}

export const useErc721CollectionContract = (collectionAddress: string, withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(erc721CollectionAbi, collectionAddress, withSignerIfPossible ? getProviderOrSigner(library, account) : null) as Erc721collection
        , [withSignerIfPossible, library, account, collectionAddress, getContract])
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
function useContract<T extends Contract = Contract>(
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true,
): T | null {
    const { library, account } = useActiveWeb3React()
    const rpcProvider = useProviders()

    return useMemo(() => {
        if (!address || !ABI || !library) return null
        try {
            if (!isAddress(address) || address === AddressZero) {
                throw Error(`Invalid 'address' parameter '${address}'.`)
            }
            const signer = withSignerIfPossible ? getProviderOrSigner(library, account) : null
            return new Contract(address, ABI, signer ?? rpcProvider)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account, rpcProvider]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
    return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract<Weth>(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        // eslint-disable-next-line default-case
        switch (chainId) {
            case ChainId.MAINNET:
            case ChainId.TESTNET:
                address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
                break
        }
    }
    return useContract<EnsRegistrar>(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
    return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract<Erc20Bytes32>(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract() {
    const { chainId } = useActiveWeb3React()

    return useContract<Multicall>(getMulticallAddress(chainId), MultiCallAbi, false)
}
