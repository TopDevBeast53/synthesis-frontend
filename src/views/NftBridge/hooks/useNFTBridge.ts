import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'

import helixNFTBridgeABI from 'config/abi/HelixNFTBridge.json'
import helixNFTABI from 'config/abi/HelixNFT.json'
import { auraNFTBridgeAddress } from '../constants'
import { auraNFTAddress } from '../../NftStaking/constants'

export const useNFTBridge = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getAuraNFTBridgeContract = useCallback(() => {
    return new Contract(auraNFTBridgeAddress, helixNFTBridgeABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getAuraNFTContract = useCallback(() => {
    return new Contract(auraNFTAddress, helixNFTABI, getProviderOrSigner(library, account))
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
      const externalTokenIdsInfo = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getAuraNFTContract(), 'getExternalTokenID', [e.id])))
      const approvedAddrsInfo = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getAuraNFTContract(), 'getApproved', [e.id])))
      const tokens = resTokensInfo.map((token:any, i)=> ({
        tokenId: token.tokenId.toString(),
        tokenOwner: token.tokenOwner.toString(),
        level: parseInt(token.level),
        isStaked: token.isStaked,
        auraPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.auraPoints.toString()))),
        remainAPToNextLevel: parseInt(formatBigNumber(ethers.BigNumber.from(token.remainAPToNextLvl.toString()))),
        uri: token.uri,
        externalTokenId: externalTokenIdsInfo[i],
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
  
  const bridgeToBSC = useCallback(async (externalTokenId, uri) => {
    const tx = await callWithGasPrice(getAuraNFTBridgeContract(), 'bridgeToBSC', [externalTokenId, account, uri])
    return tx.wait()
  }, [getAuraNFTBridgeContract, account, callWithGasPrice])

  const mintBridgedNFT = useCallback(async (externalTokenId) => {
    const tx = await callWithGasPrice(getAuraNFTBridgeContract(), 'mintBridgedNFT', [externalTokenId])
    return tx.wait()
  }, [getAuraNFTBridgeContract, callWithGasPrice])
  
  const getMinted = useCallback(async (externalTokenId) => {
    const tx = await callWithGasPrice(getAuraNFTBridgeContract(), 'getMinted', [externalTokenId])
    return tx
  }, [getAuraNFTBridgeContract, callWithGasPrice])

  const isBridged = useCallback(async (externalTokenId) => {
    const tx = await callWithGasPrice(getAuraNFTBridgeContract(), 'isBridged', [externalTokenId])
    return tx
  }, [getAuraNFTBridgeContract, callWithGasPrice])

  return {
    getUnstakedNftsFromBSC,
    bridgeToSolana,
    bridgeToBSC,
    mintBridgedNFT,
    approveToBridgeContract,
    getMinted,
    isBridged
  }
}
