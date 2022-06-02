import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import helixVault from 'config/abi/HelixVault.json'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useCallback } from 'react'
import { Deposit } from 'state/types'
import { getProviderOrSigner } from 'utils'
import { helixVaultAddress } from '../constants'

const txResponseToArray = (tx) => {
  const result = tx.toString()
  if (result === '') return []
  return result.split(',')
}
export const useHelixLockVault = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getHelixAutoPoolContract = useCallback(() => {
    return new Contract(helixVaultAddress, helixVault, getProviderOrSigner(library, account))
  }, [library, account])

  // deposit(uint amount, uint index, uint id)
  // withdraw(uint amount, uint id)
  // pendingReward(uint id)  return uint
  // claimReward(uint id)

  const getDepositIds = useCallback(async () => {
    if (!account) return []
    const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'getDepositIds', [account])
    return txResponseToArray(tx)
  }, [getHelixAutoPoolContract, callWithGasPrice, account])

  const getDepositFromId = useCallback(
    async (depositId) => {
      const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'deposits', [depositId])
      const resArr = txResponseToArray(tx)
      const deposit: Deposit = {
        id: Number(depositId),
        amount: new BigNumber(resArr[1]),
        withdrawTimeStamp: Number(resArr[4]),
        withdrawn: resArr[6] === 'true',
      }
      return deposit
    },
    [getHelixAutoPoolContract, callWithGasPrice],
  )

  const getPendingRewardFromId = useCallback(
    async (depositId) => {
      const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'pendingReward', [depositId])
      return tx.toString()
    },
    [getHelixAutoPoolContract, callWithGasPrice],
  )

  const claimReward = useCallback(
    async (depositId) => {
      const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'claimReward', [depositId])
      return tx.wait()
    },
    [getHelixAutoPoolContract, callWithGasPrice],
  )
  const compoundReward = useCallback(
    async (depositId) => {
      const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'compound', [depositId])
      return tx.wait()
    },
    [getHelixAutoPoolContract, callWithGasPrice],
  )

  const deposit = useCallback(
    async (amount, depositId) => {
      const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'updateDeposit', [amount, depositId])
      return tx.wait()
    },
    [getHelixAutoPoolContract, callWithGasPrice],
  )

  const withdraw = useCallback(
    async (amount, depositId) => {
      const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'withdraw', [amount, depositId])
      return tx.wait()
    },
    [getHelixAutoPoolContract, callWithGasPrice],
  )

  const getDurations = useCallback(async () => {
    const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'getDurations')
    return txResponseToArray(tx)
  }, [getHelixAutoPoolContract, callWithGasPrice])

  const addNewDeposit = useCallback(
    async (amount, durationIndex) => {
      const tx = await callWithGasPrice(getHelixAutoPoolContract(), 'newDeposit', [amount, durationIndex])
      return tx.wait()
    },
    [getHelixAutoPoolContract, callWithGasPrice],
  )

  return {
    getPendingRewardFromId,
    getDepositFromId,
    getDepositIds,
    getDurations,
    claimReward,
    compoundReward,
    deposit,
    withdraw,
    addNewDeposit,
  }
}
