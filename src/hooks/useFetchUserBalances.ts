import { poolsConfig } from "config/constants"
import erc20ABI from 'config/abi/erc20.json'
import { useCallback } from "react"
import BigNumber from 'bignumber.js'
import useProviders from "./useProviders"
import useMulticall from "./useMulticall"

const useFetchUserBalances = () => {
    const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'ETH')
    const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'ETH')
    const rpcProvider = useProviders()
    const multicall = useMulticall()
    // Non BNB pools
    return useCallback(async (account: string) => {
        const calls = nonBnbPools.map((pool) => ({
            address: pool.stakingToken.address,
            name: 'balanceOf',
            params: [account],
        }))
        const tokenBalancesRaw = await multicall(erc20ABI, calls)
        const tokenBalances = nonBnbPools.reduce(
            (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
            {},
        )

        // BNB pools
        const bnbBalance = await rpcProvider.getBalance(account)
        const bnbBalances = bnbPools.reduce(
            (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance.toString()).toJSON() }),
            {},
        )

        return { ...tokenBalances, ...bnbBalances }
    }, [nonBnbPools, multicall, rpcProvider, bnbPools])
}

export default useFetchUserBalances