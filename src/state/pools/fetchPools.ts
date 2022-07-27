import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'

export const fetchPoolsBlockLimits = async () => {
    const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)
    const startEndBlockCalls = poolsWithEnd.flatMap((poolConfig) => {
        return [
            {
                address: getAddress(poolConfig.contractAddress),
                name: 'startBlock',
            },
            {
                address: getAddress(poolConfig.contractAddress),
                name: 'bonusEndBlock',
            },
        ]
    })

    const startEndBlockRaw = await multicall(sousChefABI, startEndBlockCalls)

    const startEndBlockResult = startEndBlockRaw.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 2)

        if (!resultArray[chunkIndex]) {
            // eslint-disable-next-line no-param-reassign
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])

    return poolsWithEnd.map((cakePoolConfig, index) => {
        const [startBlock, endBlock] = startEndBlockResult[index]
        return {
            sousId: cakePoolConfig.sousId,
            startBlock: new BigNumber(startBlock).toJSON(),
            endBlock: new BigNumber(endBlock).toJSON(),
        }
    })
}


export const fetchPoolStakingLimit = async (): Promise<BigNumber> => {
    return new BigNumber('100000000000000000000')
    // try {
    //   const sousContract = getSouschefV2Contract(sousId)
    //   const hasUserLimit = await sousContract.hasUserLimit()
    //   if (hasUserLimit) {
    //     const stakingLimit = await sousContract.poolLimitPerUser()
    //     return new BigNumber(stakingLimit.toString())
    //   }
    //   return BIG_ZERO
    // } catch (error) {
    //   return BIG_ZERO
    // }
}

// export const fetchPoolsStakingLimits = async (
//   poolsWithStakingLimit: number[],
// ): Promise<{ [key: string]: BigNumber }> => {
// const validPools = poolsConfig
//   .filter((p) => p.stakingToken.symbol !== 'BNB' && !p.isFinished)
//   .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

// Get the staking limit for each valid pool
// const poolStakingCalls = validPools
//   .map((validPool) => {
//     const contractAddress = getAddress(validPool.contractAddress)
//     return ['hasUserLimit', 'poolLimitPerUser'].map((method) => ({
//       address: contractAddress,
//       name: method,
//     }))
//   })
//   .flat()

// const poolStakingResultRaw = await multicallv2(sousChefV2, poolStakingCalls, { requireSuccess: false })
// const chunkSize = poolStakingCalls.length / validPools.length
// const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
// return poolStakingChunkedResultRaw.reduce((accum, stakingLimitRaw, index) => {
//   const hasUserLimit = stakingLimitRaw[0]
//   const stakingLimit = hasUserLimit && stakingLimitRaw[1] ? new BigNumber(stakingLimitRaw[1].toString()) : BIG_ZERO
//   return {
//     ...accum,
//     [validPools[index].sousId]: stakingLimit,
//   }
// }, {})

// return validPools.reduce((accum, value) => {
//   return {
//     ...accum,
//     [value.sousId]:  new BigNumber("100000000000000000000"),
//   }
// }, {})

//   return {};
// }
