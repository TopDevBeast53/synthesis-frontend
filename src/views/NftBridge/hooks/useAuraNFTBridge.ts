import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import auraNFTBridgeABI from 'config/abi/auraNFTBridge.json'
import auraNFTABI from 'config/abi/AuraNFT.json'
import { auraNFTBridgeAddress } from '../constants'
import { auraNFTAddress } from '../../NftStaking/constants'

export const useAuraNFTBridge = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getAuraNFTBridgeContract = useCallback(() => {
    return new Contract(auraNFTBridgeAddress, auraNFTBridgeABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getAuraNFTContract = useCallback(() => {
    return new Contract(auraNFTAddress, auraNFTABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getUnstakedNftsFromBSC = useCallback(async () => {
    const bridgeAddr = getAuraNFTBridgeContract().address
    let tx:any
    try {
      tx = await callWithGasPrice(getAuraNFTContract(), 'getTokenIdsOfOwner', [account])
    } catch(e) {
      return []
    }
    const tokenIds = (tx.toString()).split(',').map((v)=>({id: v}))
    if (tokenIds.length > 0) {
      const resTokensInfo = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getAuraNFTContract(), 'getToken', [e.id])))
      const approvedAddrsInfo = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getAuraNFTContract(), 'getApproved', [e.id])))
      const tokens = resTokensInfo.map((token:any, i)=> ({
        tokenId: token.tokenId.toString(),
        tokenOwner: token.tokenOwner.toString(),
        level: parseInt(token.level),
        isStaked: token.isStaked,
        uri: token.uri,
        isApproved: approvedAddrsInfo[i].toString() === bridgeAddr,
      })).filter((e)=>e.isStaked===false)
      return tokens
    }
    return []
  }, [getAuraNFTBridgeContract, getAuraNFTContract, callWithGasPrice, account])
  
  const approveToBridgeContract = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'approve', [getAuraNFTBridgeContract().address, tokenId])
    return tx.wait()
  }, [getAuraNFTContract, getAuraNFTBridgeContract, callWithGasPrice])
  
  const bridgeToSolana = useCallback(async (tokenId:string, externalOwnerAddr:string) => {
    const tx = await callWithGasPrice(getAuraNFTBridgeContract(), 'bridgeToSolana', [tokenId, externalOwnerAddr])
    return tx.wait()
  }, [getAuraNFTBridgeContract, callWithGasPrice])
  
  const bridgeFromSolana = useCallback(async (externalTokenId, uri) => {
    const tx = await callWithGasPrice(getAuraNFTBridgeContract(), 'bridgeFromSolana', [externalTokenId, account, uri])
    return tx.wait()
  }, [getAuraNFTBridgeContract, account, callWithGasPrice])

  const mintBridgedNFT = useCallback(async (externalTokenId) => {
    const tx = await callWithGasPrice(getAuraNFTBridgeContract(), 'mintBridgedNFT', [externalTokenId])
    return tx.wait()
  }, [getAuraNFTBridgeContract, callWithGasPrice])
  
  return {
    getUnstakedNftsFromBSC,
    bridgeToSolana,
    bridgeFromSolana,
    mintBridgedNFT,
    approveToBridgeContract,
  }
}
