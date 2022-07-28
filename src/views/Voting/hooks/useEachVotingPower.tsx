import { useCallback, useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useHelixVault, useMasterchef, useHelixAutoPoolContract, useERC20s, useERC20 } from 'hooks/useContract'
import { ethers, BigNumber } from 'ethers'
import { useMemoFarms } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'
import { useGetTokens } from 'hooks/useGetTokens'

export const useEachVotingPower = () => {
  const { account } = useActiveWeb3React()
  const tokens = useGetTokens()
  const helixVaultContract = useHelixVault()
  const masterChefContract = useMasterchef()
  const helixAutoPoolContract = useHelixAutoPoolContract()
  const { data: farmsLP } = useMemoFarms()
  const { chainId } = useActiveWeb3React()

  const [lpPidList, lpAddressList] = useMemo(() => {
    const addresses = farmsLP
      .filter((lp) => lp.pid !== 0)
      .filter((lp) => lp.lpSymbol.includes('HELIX'))
      .map((lp) => ({
        pid: lp.pid,
        address: getAddress(chainId, lp.lpAddresses)
      }))
    const pidList = addresses.map((option) => {
      return option.pid
    })
    const addressList = addresses.map((option) => {
      return option.address
    })
    return [pidList, addressList]
  }, [chainId, farmsLP])

  const lpContracts = useERC20s(lpAddressList)
  const helixTokenContract = useERC20(tokens.helix.address)


  const getVaultHelix = useCallback(async () => {
    const vaultHelix = await helixVaultContract.getDepositAmount(account)
    return vaultHelix
  }, [helixVaultContract, account])

  const getMasterchefHelix = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [masterchefHelix, rewardDebt] = await masterChefContract.userInfo('0', account)
    return masterchefHelix
  }, [masterChefContract, account])

  const getAutoPoolHelix = useCallback(async () => {
    const [userInfo, totalShares] = await Promise.all([
      helixAutoPoolContract.userInfo(account),
      helixAutoPoolContract.getPricePerFullShare()
    ]);

    const autoPoolHelix = userInfo[0].mul(totalShares).div(ethers.utils.parseUnits('1'))

    return autoPoolHelix
  }, [helixAutoPoolContract, account])

  const getLpHelix = useCallback(async () => {
    const eachLpHelixs = await Promise.all(
      lpContracts.map(async (lpContract, index) => {
        const [userInfo, totalSupply, balanceOf] = await Promise.all([
          masterChefContract.userInfo(lpPidList[index], account),
          lpContract.totalSupply(),
          helixTokenContract.balanceOf(lpAddressList[index])
        ])
        const eachLpHelix = userInfo[0].mul(balanceOf).div(totalSupply)
        return eachLpHelix
      }
      ))
    let totalLpHelix = BigNumber.from(0)
    for (let i = 0; i < eachLpHelixs.length; i++) {
      totalLpHelix = eachLpHelixs[i].add(totalLpHelix)
    }
    return totalLpHelix
  }, [helixTokenContract, masterChefContract, lpContracts, lpAddressList, lpPidList, account])

  return {
    getVaultHelix,
    getMasterchefHelix,
    getAutoPoolHelix,
    getLpHelix,
  }
}
