import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import auraNFTABI from 'config/abi/AuraNFT.json'
import { auraNFTAddress } from '../constants'

export const useGetAuraNftInfo = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getAuraNFTContract = useCallback(() => {
    return new Contract(auraNFTAddress, auraNFTABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getLastTokenId = useCallback(async () => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'getLastTokenId', [])
    return tx.toString()
  }, [getAuraNFTContract, callWithGasPrice])

  const getAuraNftInfoById = useCallback(async (tokenId) => {
    const token:any = await callWithGasPrice(getAuraNFTContract(), 'getToken', [tokenId])
    const res = {
      tokenId: token.tokenId.toString(),
      tokenOwner: token.tokenOwner.toString(),
      level: parseInt(token.level),
      auraPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.auraPoints.toString()))),
      remainAPToNextLevel: parseInt(formatBigNumber(ethers.BigNumber.from(token.remainAPToNextLvl.toString()))),
      isStaked: token.isStaked,
      uri: token.uri,
    }
    return res
  }, [getAuraNFTContract, callWithGasPrice])

  const getTokenIdsOfOwner = useCallback(async () => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'getTokenIdsOfOwner', [account])
    return (tx.toString()).split(',').map((v)=>({id: v}))
  }, [getAuraNFTContract, callWithGasPrice, account])

  const getTokensOfOwnerByIds = useCallback(async (tokenIds) => {
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
  }, [getAuraNFTContract, callWithGasPrice])
  
  const getTokens = useCallback(async () => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'getTokenIdsOfOwner', [account])
    const tokenIds = (tx.toString()).split(',').map((v)=>({id: v}))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAuraNFTContract, callWithGasPrice, account])

  return {
    getLastTokenId,
    getAuraNftInfoById,
    getTokenIdsOfOwner,
    getTokensOfOwnerByIds,
    getTokens,
  }
}
