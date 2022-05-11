import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import helixNFTABI from 'config/abi/HelixNFT.json'
import { helixNFTAddress } from '../constants'
import { TokenInfo } from '../type'

export const useGetNftInfo = () => {
    const { library, account } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()

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
        let tx: any
        try {
            tx = await callWithGasPrice(getHelixNFTContract(), 'getTokenIdsOfOwner', [account])
        } catch (e) {
            return []
        }
        const tokenIds = tx
            .toString()
            .split(',')
            .map((v) => ({ id: v }))
        if (tokenIds.length > 0) {
            const results = await Promise.all(
                tokenIds.map((e: any) => callWithGasPrice(getHelixNFTContract(), 'getToken', [e.id])),
            )
            const res = results.map((token: any) => ({
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
        }
        return []
    }, [getHelixNFTContract, callWithGasPrice, account])

    return {
        getLastTokenId,
        getHelixNftInfoById,
        getTokensOfOwnerByIds,
        getTokens,
    }
}
