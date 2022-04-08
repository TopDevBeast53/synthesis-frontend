import BigNumber from 'bignumber.js'
import { getHelixAutoPoolContract } from 'utils/contractHelpers'

const helixAutoPoolContract = getHelixAutoPoolContract()

const fetchVaultUser = async (account: string) => {
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
}

export default fetchVaultUser
