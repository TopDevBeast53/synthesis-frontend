import React from 'react'
import { Flex, Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { usePriceAuraBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getAuraVaultEarnings } from 'views/Pools/helpers'
import RecentAuraProfitBalance from './RecentAuraProfitBalance'

const RecentAuraProfitCountdownRow = ({ vaultKey }: { vaultKey: VaultKey }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    pricePerFullShare,
    userData: { auraAtLastUserAction, userShares, lastUserActionTime },
  } = useVaultPoolByKey(vaultKey)
  const auraPriceBusd = usePriceAuraBusd()
  const { hasAutoEarnings, autoAuraToDisplay, autoUsdToDisplay } = getAuraVaultEarnings(
    account,
    auraAtLastUserAction,
    userShares,
    pricePerFullShare,
    auraPriceBusd.toNumber(),
  )

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent AURA profit')}:`}</Text>
      {hasAutoEarnings && (
        <RecentAuraProfitBalance
          auraToDisplay={autoAuraToDisplay}
          dollarValueToDisplay={autoUsdToDisplay}
          dateStringToDisplay={dateStringToDisplay}
        />
      )}
    </Flex>
  )
}

export default RecentAuraProfitCountdownRow
