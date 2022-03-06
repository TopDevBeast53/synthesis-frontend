import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getActivePools } from 'utils/calls'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import { getVotingPower } from '../helpers'

interface State {
  verificationHash: string
  auraBalance: number
  auraVaultBalance: number
  auraPoolBalance: number
  poolsBalance: number
  auraBnbLpBalance: number
  ifoPoolBalance: number
  total: number
}

const initialState: State = {
  verificationHash: null,
  auraBalance: 0,
  auraVaultBalance: 0,
  auraPoolBalance: 0,
  poolsBalance: 0,
  auraBnbLpBalance: 0,
  ifoPoolBalance: 0,
  total: 0,
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean } => {
  const { account } = useWeb3React()
  const [votingPower, setVotingPower] = useState(initialState)
  const [isLoading, setIsLoading] = useState(!!account)

  useEffect(() => {
    const fetchVotingPower = async () => {
      setIsLoading(true)

      try {
        const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
        const eligiblePools = await getActivePools(blockNumber)
        const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress))
        const {
          auraBalance,
          auraBnbLpBalance,
          auraPoolBalance,
          total,
          poolsBalance,
          auraVaultBalance,
          verificationHash,
          IFOPoolBalance,
        } = await getVotingPower(account, poolAddresses, blockNumber)

        if (isActive) {
          setVotingPower((prevVotingPower) => ({
            ...prevVotingPower,
            verificationHash,
            auraBalance: parseFloat(auraBalance),
            auraBnbLpBalance: parseFloat(auraBnbLpBalance),
            auraPoolBalance: parseFloat(auraPoolBalance),
            poolsBalance: parseFloat(poolsBalance),
            auraVaultBalance: parseFloat(auraVaultBalance),
            ifoPoolBalance: IFOPoolBalance ? parseFloat(IFOPoolBalance) : 0,
            total: parseFloat(total),
          }))
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (account && isActive) {
      fetchVotingPower()
    }
  }, [account, block, setVotingPower, isActive, setIsLoading])

  return { ...votingPower, isLoading }
}

export default useGetVotingPower
