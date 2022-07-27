import poolsConfig from 'config/constants/pools'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

// Pool 0, HELIX/ HELIXis a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'ETH')

export const fetchPoolsAllowance = async (account) => {
    const calls = nonBnbPools.map((pool) => ({
        address: pool.stakingToken.address,
        name: 'allowance',
        params: [account, getAddress(pool.contractAddress)],
    }))

    const allowances = await multicall(erc20ABI, calls)
    return nonBnbPools.reduce(
        (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
        {},
    )
}
