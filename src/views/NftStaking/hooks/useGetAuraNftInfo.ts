import { useCallback } from 'react'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getProviderOrSigner } from 'utils'
import { ethers } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Contract } from '@ethersproject/contracts'
import auraNFTABI from 'config/abi/AuraNFT.json'

import { auraNFTAddress } from '../constants'


export const useGetLastTokenId = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleLastTokenId = useCallback(async () => {
    const contract = new Contract(auraNFTAddress, auraNFTABI, getProviderOrSigner(library, account))
    const tx = await callWithGasPrice(contract, 'getLastTokenId', [])
    return tx.toString()
  }, [callWithGasPrice, library, account])
  return { onGetLastTokenId: handleLastTokenId }
}

export const useGetAuraNftInfoById = (tokenId: number) => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleAuraNftInfoById = useCallback(async () => {
    const contract = new Contract(auraNFTAddress, auraNFTABI, getProviderOrSigner(library, account))
    const tx = await callWithGasPrice(contract, 'getToken', [tokenId])
    return tx
  }, [tokenId, callWithGasPrice, library, account])
  return { onGetAuraNftInfoById: handleAuraNftInfoById }
}

export const useGetTokenIdsOfOwner = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleTokenIdsOfOwner = useCallback(async () => {
    const contract = new Contract(auraNFTAddress, auraNFTABI, getProviderOrSigner(library, account))
    const tx = await callWithGasPrice(contract, 'getTokenIdsOfOwner', [account])
    return (tx.toString()).split(',').map((v)=>({id: v}))
  }, [callWithGasPrice, library, account])
  return { onGetTokenIdsOfOwner: handleTokenIdsOfOwner }
}

export const useGetTokensOfOwner = (tokenIds) => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  

  const handleTokensOfOwner = useCallback(async () => {
    const contract = new Contract(auraNFTAddress, auraNFTABI, getProviderOrSigner(library, account))
    const results = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(contract, 'getToken', [e.id])))
    const res = results.map((token)=> ({
      tokenId: token.tokenId.toString(),
      tokenOwner: token.tokenOwner.toString(),
      level: parseInt(token.level),
      auraPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.auraPoints.toString()))),
      isStaked: token.isStaked,
      uri: token.uri,
    }))
    return res
  }, [tokenIds, callWithGasPrice, library, account])
  return { onGetTokensOfOwner: handleTokensOfOwner }
}

