import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { formatBigNumber, getDecimalAmount } from 'utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import auraNFTABI from 'config/abi/AuraNFT.json'
import auraChefNFTABI from 'config/abi/AuraChefNFT.json'
import { auraNFTAddress, auraNFTChefAddress } from '../constants'

export const useBoostNft = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getAuraNFTContract = useCallback(() => {
    return new Contract(auraNFTAddress, auraNFTABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getAuraChefNFTContract = useCallback(() => {
    return new Contract(auraNFTChefAddress, auraChefNFTABI, getProviderOrSigner(library, account))
  }, [library, account])

  const getAccumulatedAP = useCallback(async () => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'getAccumulatedAP', [account])
    return formatBigNumber(ethers.BigNumber.from(tx.toString()))
  }, [getAuraNFTContract, callWithGasPrice, account])

  const getLevel = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'getLevel', [tokenId])
    return tx.toString()
  }, [getAuraNFTContract, callWithGasPrice])

  const getAuraPoints = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'getAuraPoints', [tokenId])
    return tx.toString()
  }, [getAuraNFTContract, callWithGasPrice])

  const getRemainAPToNextLevel = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getAuraNFTContract(), 'remainAPToNextLevel', [tokenId])
    return tx.toString()
  }, [getAuraNFTContract, callWithGasPrice])

  const boostAuraNFT = useCallback(async (tokenId, amount) => {
    const tx = await callWithGasPrice(getAuraChefNFTContract(), 'boostAuraNFT', [tokenId, (getDecimalAmount(new BigNumber(amount))).toString()])
    return tx.wait()
  }, [getAuraChefNFTContract, callWithGasPrice])
  
  
  return {
    getAccumulatedAP,
    getLevel,
    getAuraPoints,
    getRemainAPToNextLevel,
    boostAuraNFT,
  }
}
