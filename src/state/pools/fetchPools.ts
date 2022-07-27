import BigNumber from 'bignumber.js'

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
