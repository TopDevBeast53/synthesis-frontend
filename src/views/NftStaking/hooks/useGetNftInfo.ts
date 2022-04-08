import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import helixNFTABI from 'config/abi/HelixNFT.json'
import { auraNFTAddress } from '../constants'
import { TokenInfo } from '../type'

export const useGetNftInfo = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getAuraNFTContract = useCallback(() => {
    return new Contract(auraNFTAddress, helixNFTABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getLastTokenId = useCallback(async () => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'getLastTokenId', [])
    return tx.toString()
  }, [getAuraNFTContract, callWithGasPrice])

  const getAuraNftInfoById = useCallback(async (tokenId: string) => {
    const token: any = await callWithGasPrice(getAuraNFTContract(), 'getToken', [tokenId])
    const res: TokenInfo = {
      tokenId: token.tokenId.toString(),
      tokenOwner: token.tokenOwner.toString(),
      level: parseInt(token.level),
      auraPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.auraPoints.toString()))),
      remainAPToNextLevel: parseInt(formatBigNumber(ethers.BigNumber.from(token.remainAPToNextLvl.toString()))),
      isStaked: token.isStaked,
      uri: token.uri.toString(),
      disabled: false,
    }
    return res
  }, [getAuraNFTContract, callWithGasPrice])

  const getTokensOfOwnerByIds = useCallback(async (tokenIds) => {
    const results: any = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getAuraNFTContract(), 'getToken', [e.id])))
    const res: TokenInfo[] = results.map((token:any)=> ({
      tokenId: token.tokenId.toString(),
      tokenOwner: token.tokenOwner.toString(),
      level: parseInt(token.level),
      auraPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.auraPoints.toString()))),
      remainAPToNextLevel: parseInt(formatBigNumber(ethers.BigNumber.from(token.remainAPToNextLvl.toString()))),
      isStaked: token.isStaked,
      uri: token.uri,
      disabled: false,
    }))
    return res
  }, [getAuraNFTContract, callWithGasPrice])
  
  const getTokens = useCallback(async () => {
    let tx:any
    try {
      tx = await callWithGasPrice(getAuraNFTContract(), 'getTokenIdsOfOwner', [account])
    } catch(e) {
      return []
    }
    const tokenIds = (tx.toString()).split(',').map((v)=>({id: v}))
    if (tokenIds.length>0){
      const results = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getAuraNFTContract(), 'getToken', [e.id])))
      const res = results.map((token:any)=> ({
        tokenId: token.tokenId.toString(),
        tokenOwner: token.tokenOwner.toString(),
        level: parseInt(token.level),
        auraPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.auraPoints.toString()))),
        remainAPToNextLevel: parseInt(formatBigNumber(ethers.BigNumber.from(token.remainAPToNextLvl.toString()))),
        isStaked: token.isStaked,
        uri: token.uri,
        disabled: false,
      }))
      return res
    }
    return []
  }, [getAuraNFTContract, callWithGasPrice, account])

  return {
    getLastTokenId,
    getAuraNftInfoById,
    getTokensOfOwnerByIds,
    getTokens,
  }
}
