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

  const getHelixAutoPoolContract = useCallback(() => {
    return new Contract(helixVaultAddress, helixVault, getProviderOrSigner(library, account))
  }, [library, account])

    // deposit(uint amount, uint index, uint id)
    // withdraw(uint amount, uint id)
    // pendingReward(uint id)  return uint
    // claimReward(uint id)
  
  const getLevel = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'getLevel', [tokenId])
    return tx.toString()
  }, [getHelixAutoPoolContract, callWithGasPrice])

  const getHelixPoints = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'getHelixPoints', [tokenId])
    return tx.toString()
  }, [getHelixAutoPoolContract, callWithGasPrice])

  const getremainHPToNextLevel = useCallback(async (tokenId) => {
    const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'remainHPToNextLevel', [tokenId])
    return tx.toString()
  }, [getHelixAutoPoolContract, callWithGasPrice])

  return {
    getLevel,
    getHelixPoints,
    getremainHPToNextLevel,    
  }
}
