import React, { useMemo } from 'react'
import { Flex, Skeleton, Text } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { DeserializedPool } from 'state/types'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool: DeserializedPool
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked, vaultKey } = pool
  const { totalHelixInVault } = useVaultPoolByKey(vaultKey)
  const vaultPools = useVaultPools()

  const helixInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalHelixInVault)
  }, BIG_ZERO)

  const isManualHelixPool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalHelixInVault, stakingToken.decimals)
    }
    if (isManualHelixPool) {
      const manualHelixTotalMinusAutoVault = new BigNumber(totalStaked).minus(helixInVaults)
      const balanceNumber = getBalanceNumber(manualHelixTotalMinusAutoVault, stakingToken.decimals)

      return balanceNumber < 0 ? 0 : balanceNumber
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalHelixInVault, isManualHelixPool, totalStaked, stakingToken.decimals, helixInVaults])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        {totalStaked && totalStaked.gte(0) ? (
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
