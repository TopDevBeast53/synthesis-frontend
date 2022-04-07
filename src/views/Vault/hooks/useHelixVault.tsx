import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { formatBigNumber, getDecimalAmount } from 'utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import helixVault from 'config/abi/HelixVault.json'
import { helixVaultAddress } from '../constants'

export const useHelixVault = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getHelixVaultContract = useCallback(() => {
    return new Contract(helixVaultAddress, helixVault, getProviderOrSigner(library, account))
  }, [library, account])

    // deposit(uint amount, uint index, uint id)
    // withdraw(uint amount, uint id)
    // pendingReward(uint id)  return uint
    // claimReward(uint id)
  const getAccumulatedAP = useCallback(async () => {
    const tx = await callWithGasPrice(getHelixVaultContract(), 'getAccumulatedAP', [account])
    return formatBigNumber(ethers.BigNumber.from(tx.toString()))
  }, [getHelixVaultContract, callWithGasPrice, account])

  const getLevel = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getHelixVaultContract(), 'getLevel', [tokenId])
    return tx.toString()
  }, [getHelixVaultContract, callWithGasPrice])

  const getAuraPoints = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getHelixVaultContract(), 'getAuraPoints', [tokenId])
    return tx.toString()
  }, [getHelixVaultContract, callWithGasPrice])

  const getRemainAPToNextLevel = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getHelixVaultContract(), 'remainAPToNextLevel', [tokenId])
    return tx.toString()
  }, [getHelixVaultContract, callWithGasPrice])

  
  
  return {
    getAccumulatedAP,
    getLevel,
    getAuraPoints,
    getRemainAPToNextLevel,    
  }
}
