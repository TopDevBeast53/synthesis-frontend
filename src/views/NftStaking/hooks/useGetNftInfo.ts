import { Contract } from '@ethersproject/contracts'
import helixNFTABI from 'config/abi/HelixNFT.json'
import { ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useHelixNFT } from 'hooks/useContract'
import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { formatBigNumber } from 'utils/formatBalance'
import { helixNFTAddress } from '../constants'
import { TokenInfo } from '../type'


export const useGetNftInfo = () => {
    const { library, account } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()
    const helixNFTContract = useHelixNFT()

    const getHelixNFTContract = useCallback(() => {
        return new Contract(helixNFTAddress, helixNFTABI, getProviderOrSigner(library, account))
    }, [library, account])

    const getLastTokenId = useCallback(async () => {
        const tx = await callWithGasPrice(getHelixNFTContract(), 'getLastTokenId', [])
        return tx.toString()
    }, [getHelixNFTContract, callWithGasPrice])

    const getHelixNftInfoById = useCallback(
        async (tokenId: string) => {
            const token: any = await callWithGasPrice(getHelixNFTContract(), 'getToken', [tokenId])
            const res: TokenInfo = {
                tokenId: token.tokenId.toString(),
                tokenOwner: token.tokenOwner.toString(),
                level: parseInt(token.level),
                helixPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.helixPoints.toString()))),
                remainHPToNextLevel: parseInt(
                    formatBigNumber(ethers.BigNumber.from(token.remainHPToNextLvl.toString())),
                ),
                isStaked: token.isStaked,
                uri: token.uri.toString(),
                disabled: false,
            }
            return res
        },
        [getHelixNFTContract, callWithGasPrice],
    )

    const getTokensOfOwnerByIds = useCallback(
        async (tokenIds) => {
            const results: any = await Promise.all(
                tokenIds.map((e: any) => callWithGasPrice(getHelixNFTContract(), 'getToken', [e.id])),
            )
            const res: TokenInfo[] = results.map((token: any) => ({
                tokenId: token.tokenId.toString(),
                tokenOwner: token.tokenOwner.toString(),
                level: parseInt(token.level),
                helixPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.helixPoints.toString()))),
                remainHPToNextLevel: parseInt(
                    formatBigNumber(ethers.BigNumber.from(token.remainHPToNextLvl.toString())),
                ),
                isStaked: token.isStaked,
                uri: token.uri,
                disabled: false,
            }))
            return res
        },
        [getHelixNFTContract, callWithGasPrice],
    )

    const getTokens = useCallback(async () => {
        let ids=[]
        try {
            ids = await helixNFTContract.getTokenIdsOfOwner(account)
        } catch (e) {
            return []
        }
        
        if (ids.length > 0) {
            const results = await Promise.all(
                ids.map((id: any) => helixNFTContract.getToken(id))
            )
            const res = results.map(([tokenOwner,uri, tokenId, token]) => ({
                tokenId: tokenId.toString(),
                externalTokenIds: token.mintTokenIDs,
                nftNames: token.nftIDs,
                tokenOwner, 
                wrappedNfts:token.wrappedNfts.toString(),               
                isStaked: token.isStaked,
                uri,
                disabled: false,
            }))
            return res
        }
        return []
    }, [helixNFTContract, account])

    return {
        getLastTokenId,
        getHelixNftInfoById,
        getTokensOfOwnerByIds,
        getTokens,
    }
}
