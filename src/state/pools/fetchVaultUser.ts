import BigNumber from 'bignumber.js'
import { getAuraVaultContract } from 'utils/contractHelpers'

const auraVaultContract = getAuraVaultContract()

const fetchVaultUser = async (account: string) => {
  try {
    const userContractResponse = await auraVaultContract.userInfo(account)
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
