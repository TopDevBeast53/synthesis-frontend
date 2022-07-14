import React from 'react'
import { Flex, Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { usePriceHelixBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getVaultEarnings } from 'views/Pools/helpers'
import RecentHelixProfitBalance from './RecentHelixProfitBalance'

const RecentHelixProfitCountdownRow = ({ vaultKey }: { vaultKey: VaultKey }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    pricePerFullShare,
    userData: { helixAtLastUserAction, userShares, lastUserActionTime },
  } = useVaultPoolByKey(vaultKey)
  const helixPriceBusd = usePriceHelixBusd()
  const { hasAutoEarnings, autoHelixToDisplay, autoUsdToDisplay } = getVaultEarnings(
    account,
    helixAtLastUserAction,
    userShares,
    pricePerFullShare,
    helixPriceBusd.toNumber(),
  )

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent HELIX rewards')}:`}</Text>
      {hasAutoEarnings && (
        <RecentHelixProfitBalance
          helixToDisplay={autoHelixToDisplay}
          dollarValueToDisplay={autoUsdToDisplay}
          dateStringToDisplay={dateStringToDisplay}
        />
      )}
    </Flex>
  )
}

export default RecentHelixProfitCountdownRow
