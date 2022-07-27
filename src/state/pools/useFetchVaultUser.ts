import BigNumber from 'bignumber.js'
import { useHelixAutoPoolContract } from 'hooks/useContract'
import { useCallback } from 'react'

const useFetchVaultUser = () => {
    const helixAutoPoolContract = useHelixAutoPoolContract()
    return useCallback(async (account: string) => {
        try {
            const userContractResponse = await helixAutoPoolContract.userInfo(account)
            return {
                isLoading: false,
                userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
                lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
                lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
                helixAtLastUserAction: new BigNumber(userContractResponse.helixAtLastUserAction.toString()).toJSON(),
            }
        } catch (error) {
            return {
                isLoading: true,
                userShares: null,
                lastDepositedTime: null,
                lastUserActionTime: null,
                helixAtLastUserAction: null,
            }
        }
    }, [helixAutoPoolContract])
}

export default useFetchVaultUser
