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
import tokens from 'config/constants/tokens'
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
    return useMemo(() => getContract(helixAbi, tokens.helix.address, library.getSigner()) as Helix,
        [getContract, library])
}

export const useHelixVault = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(helixVaultAbi, getHelixVaultAddress(), library.getSigner()) as HelixVault,
        [getContract, library])
}

export const useHelixYieldSwap = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(yieldSwapAbi, getYieldSwapAddress(), library.getSigner()) as HelixYieldSwap,
        [getContract, library])
}

export const useHelixLpSwap = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(lpSwapAbi, getHelixLPSwapAddress(), library.getSigner()) as HelixLpSwap,
        [getContract, library])
}
export const useHelixNFT = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(NFTAbi, getHelixNftAddress(), library.getSigner()) as HelixNFT,
        [getContract, library])
}
export const useHelixNFTChef = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(cheftNFTAbi, getHelixChefNftAddress(), library.getSigner()) as HelixChefNFT,
        [getContract, library])
}
export const useHelixNFTBridge = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bridgeNFTAbi, getHelixNftBridgeAddress(), library.getSigner()) as HelixNFTBridge,
        [getContract, library])
}
export const useBunnyFactory = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), library.getSigner()) as BunnyFactory,
        [library, getContract])
}

export const usePancakeRabbits = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress(), library.getSigner()) as PancakeRabbits,
        [getContract, library])
}

export const useProfile = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(profileABI, getPancakeProfileAddress(), library.getSigner()) as PancakeProfile,
        [getContract, library])
}

export const useLotteryV2Contract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(lotteryV2Abi, getLotteryV2Address(), library.getSigner()) as LotteryV2,
        [library, getContract])
}

export const useMasterchef = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(masterChef, getMasterChefAddress(), library.getSigner()) as Masterchef,
        [getContract, library])
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
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()

    return useMemo(() => getContract(pointCenterIfo, getPointCenterIfoAddress(), library.getSigner()) as PointCenterIfo,
        [getContract, library])
}

export const useBunnySpecialContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnySpecialAbi, getBunnySpecialAddress(), library.getSigner()) as BunnySpecial,
        [library, getContract])
}

export const useClaimRefundContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(claimRefundAbi, getClaimRefundAddress(), library.getSigner()) as ClaimRefund,
        [getContract, library])
}

export const useEasterNftContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(easterNftAbi, getEasterNftAddress(), library.getSigner()) as EasterNft,
        [getContract, library])
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
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(helixAutoPoolAbi, getHelixAutoPoolAddress(), library.getSigner()) as HelixAutoPool,
        [getContract, library])
}

export const useCakeVaultContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(helixAutoPoolAbi, getHelixAutoPoolAddress(), library.getSigner()) as HelixAutoPool,
        [getContract, library])
}

export const useIfoPoolContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(ifoPoolAbi, getIfoPoolAddress(), library.getSigner()) as IfoPool,
        [getContract, library])
}

export const usePredictionsContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(predictionsAbi, getPredictionsAddress(), library.getSigner()) as Predictions,
        [getContract, library])
}

export const useChainlinkOracleContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(chainlinkOracleAbi, getChainlinkOracleAddress(), library.getSigner()) as ChainlinkOracle,
        [getContract, library])
}

export const useSpecialBunnyPredictionContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnySpecialPredictionAbi, getBunnySpecialPredictionAddress(), library.getSigner()) as BunnySpecialPrediction,
        [getContract, library])
}

export const useBunnySpecialLotteryContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnySpecialLotteryAbi, getBunnySpecialLotteryAddress(), library.getSigner()) as BunnySpecialLottery,
        [getContract, library])
}

export const useBunnySpecialXmasContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(bunnySpecialXmasAbi, getBunnySpecialXmasAddress(), library.getSigner()),
        [getContract, library])
}

export const useAnniversaryAchievementContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(anniversaryAchievementAbi, getAnniversaryAchievement(), library.getSigner()) as AnniversaryAchievement,
        [getContract, library])
}

export const useNftSaleContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(nftSaleAbi, getNftSaleAddress(), library.getSigner()) as NftSale,
        [getContract, library])
}

export const usePancakeSquadContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(pancakeSquadAbi, getPancakeSquadAddress(), library.getSigner()) as PancakeSquad,
        [getContract, library])
}

export const useFarmAuctionContract = () => {
    const { account, library } = useActiveWeb3React()
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
    return useMemo(() => getContract(farmAuctionAbi, getFarmAuctionAddress(), account ? library.getSigner() : library) as FarmAuction,
        [getContract, account, library])
}

export const useNftMarketContract = () => {
    const { library } = useActiveWeb3React()
    const getContract = useGetContract()
    return useMemo(() => getContract(nftMarketAbi, getNftMarketAddress(), library.getSigner()) as NftMarket,
        [getContract, library])
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
    return useContract<Multicall>(getMulticallAddress(), MultiCallAbi, false)
}
