import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'

import helixNFTBridgeABI from 'config/abi/HelixNFTBridge.json'
import helixNFTABI from 'config/abi/HelixNFT.json'
import { helixNFTBridgeAddress } from '../constants'
import { helixNFTAddress } from '../../NftStaking/constants'

export const useNFTBridge = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getHelixNFTBridgeContract = useCallback(() => {
    return new Contract(helixNFTBridgeAddress, helixNFTBridgeABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getHelixNFTContract = useCallback(() => {
    return new Contract(helixNFTAddress, helixNFTABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getUnstakedNftsFromBSC = useCallback(async () => {
    const bridgeAddr = getHelixNFTBridgeContract().address
    let tx:any
    try {
      tx = await callWithGasPrice(getHelixNFTContract(), 'getTokenIdsOfOwner', [account])
    } catch(e) {
      return []
    }
    const tokenIds = (tx.toString()).split(',').map((v)=>({id: v}))
    if (tokenIds.length > 0) {
      const resTokensInfo = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getHelixNFTContract(), 'getToken', [e.id])))
      const externalTokenIdsInfo = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getHelixNFTContract(), 'getExternalTokenID', [e.id])))
      const approvedAddrsInfo = await Promise.all(tokenIds.map((e:any)=>callWithGasPrice(getHelixNFTContract(), 'getApproved', [e.id])))
      const tokens = resTokensInfo.map((token:any, i)=> ({
        tokenId: token.tokenId.toString(),
        tokenOwner: token.tokenOwner.toString(),
        level: parseInt(token.level),
        isStaked: token.isStaked,
        helixPoints: parseInt(formatBigNumber(ethers.BigNumber.from(token.helixPoints.toString()))),
        remainHPToNextLevel: parseInt(formatBigNumber(ethers.BigNumber.from(token.remainHPToNextLvl.toString()))),
        uri: token.uri,
        externalTokenId: externalTokenIdsInfo[i],
        isApproved: approvedAddrsInfo[i].toString() === bridgeAddr,
      })).filter((e)=>e.isStaked===false)
      return tokens
    }
    return []
  }, [getHelixNFTBridgeContract, getHelixNFTContract, callWithGasPrice, account])
  
  const approveToBridgeContract = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getHelixNFTContract(), 'approve', [getHelixNFTBridgeContract().address, tokenId])
    return tx.wait()
  }, [getHelixNFTContract, getHelixNFTBridgeContract, callWithGasPrice])
  
  const bridgeToSolana = useCallback(async (tokenId:string, externalOwnerAddr:string) => {
    const tx = await callWithGasPrice(getHelixNFTBridgeContract(), 'bridgeToSolana', [tokenId, externalOwnerAddr])
    return tx.wait()
  }, [getHelixNFTBridgeContract, callWithGasPrice])
  
  const bridgeToBSC = useCallback(async (externalTokenId, uri) => {
    const tx = await callWithGasPrice(getHelixNFTBridgeContract(), 'bridgeToBSC', [externalTokenId, account, uri])
    return tx.wait()
  }, [getHelixNFTBridgeContract, account, callWithGasPrice])

  const mintBridgedNFT = useCallback(async (externalTokenId) => {
    const tx = await callWithGasPrice(getHelixNFTBridgeContract(), 'mintBridgedNFT', [externalTokenId])
    return tx.wait()
  }, [getHelixNFTBridgeContract, callWithGasPrice])
  
  const getMinted = useCallback(async (externalTokenId) => {
    const tx = await callWithGasPrice(getHelixNFTBridgeContract(), 'getMinted', [externalTokenId])
    return tx
  }, [getHelixNFTBridgeContract, callWithGasPrice])

  const isBridged = useCallback(async (externalTokenId) => {
    const tx = await callWithGasPrice(getHelixNFTBridgeContract(), 'isBridged', [externalTokenId])
    return tx
  }, [getHelixNFTBridgeContract, callWithGasPrice])

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
