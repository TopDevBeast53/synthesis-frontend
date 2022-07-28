import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { ethers } from 'ethers'
import useSWR from 'swr'
import { BIG_ZERO } from 'utils/bigNumber'
import useProviders from 'hooks/useProviders'
import { useHelix, useTokenContract } from './useContract'
import { useSWRContract } from './useSWRContract'
import { useGetTokens } from './useGetTokens'

const useTokenBalance = (tokenAddress: string) => {
    const { account } = useWeb3React()

    const contract = useTokenContract(tokenAddress, false)
    const { data, status, ...rest } = useSWRContract(
        account
            ? {
                contract,
                methodName: 'balanceOf',
                params: [account],
            }
            : null,
        {
            refreshInterval: FAST_INTERVAL,
        },
    )

    return {
        ...rest,
        fetchStatus: status,
        balance: data ? new BigNumber(data.toString()) : BIG_ZERO,
    }
}

export const useTotalSupply = () => {
    const cakeContract = useHelix()
    const { data } = useSWRContract([cakeContract, 'totalSupply'], {
        refreshInterval: SLOW_INTERVAL,
    })

    return data ? new BigNumber(data.toString()) : null
}

export const useBurnedBalance = (tokenAddress: string) => {
    const contract = useTokenContract(tokenAddress, false)
    const { data } = useSWRContract([contract, 'balanceOf', ['0x000000000000000000000000000000000000dEaD']], {
        refreshInterval: SLOW_INTERVAL,
    })

    return data ? new BigNumber(data.toString()) : BIG_ZERO
}

export const useGetBnbBalance = () => {
    const { account } = useWeb3React()
    const rpcProvider = useProviders()
    const { status, data, mutate } = useSWR([account, 'bnbBalance'], async () => {
        return rpcProvider.getBalance(account)
    })

    return { balance: data || ethers.constants.Zero, fetchStatus: status, refresh: mutate }
}

export const useGetCakeBalance = () => {
    const tokens = useGetTokens()
    const { balance, fetchStatus } = useTokenBalance(tokens.helix.address)

    // TODO: Remove ethers conversion once useTokenBalance is converted to ethers.BigNumber
    return { balance: ethers.BigNumber.from(balance.toString()), fetchStatus }
}

export const useGetHelixBalance = () => {
    const tokens = useGetTokens()
    const { balance, fetchStatus } = useTokenBalance(tokens.helix.address)

    // TODO: Remove ethers conversion once useTokenBalance is converted to ethers.BigNumber
    return { balance: ethers.BigNumber.from(balance.toString()), fetchStatus }
}

export default useTokenBalance
