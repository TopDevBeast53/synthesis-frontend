import BigNumber from 'bignumber.js'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import { useMulticallv2 } from 'hooks/useMulticall'
import { useCallback } from 'react'
import { getIfoPoolAddress } from 'utils/addressHelpers'

const useFetchIfoPoolUser = () => {
    const multicallv2 = useMulticallv2()
    return useCallback(async (account: string) => {
        try {
            const calls = ['userInfo', 'getUserCredit'].map((method) => ({
                address: getIfoPoolAddress(),
                name: method,
                params: [account],
            }))
            const [userContractResponse, creditResponse] = await multicallv2(ifoPoolAbi, calls)

            return {
                isLoading: false,
                userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
                lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
                lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
                helixAtLastUserAction: new BigNumber(userContractResponse.helixAtLastUserAction.toString()).toJSON(),
                credit: new BigNumber(creditResponse.avgBalance.toString()).toJSON(),
            }
        } catch (error) {
            return {
                isLoading: true,
                userShares: null,
                lastDepositedTime: null,
                lastUserActionTime: null,
                helixAtLastUserAction: null,
                credit: null,
            }
        }
    }, [multicallv2])
}

export default useFetchIfoPoolUser
