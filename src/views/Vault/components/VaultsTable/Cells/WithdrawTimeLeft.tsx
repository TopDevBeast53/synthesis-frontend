import React, { useMemo } from 'react'
import { Flex, Skeleton, Text, useMatchBreakpoints } from 'uikit'
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

const WithdrawTimeLeft: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { sousId, stakingToken, totalStaked, vaultKey } = pool
  const { totalHelixInVault } = useVaultPoolByKey(vaultKey)
  const vaultPools = useVaultPools()

  const helixInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalHelixInVault)
  }, BIG_ZERO)

  const isManualHelixPool = sousId === 0

  const withdrawTimeLeft = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalHelixInVault, stakingToken.decimals)
    }
    if (isManualHelixPool) {
      const manualHelixTotalMinusAutoVault = new BigNumber(totalStaked).minus(helixInVaults)

      return getBalanceNumber(manualHelixTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalHelixInVault, isManualHelixPool, totalStaked, stakingToken.decimals, helixInVaults])

  const balanceFontSize = isMobile ? "14px" : "16px";
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Withdraw Time Left')}
        </Text>
        {totalStaked && totalStaked.gte(0) ? (
          <Flex height="20px" alignItems="center" mt={2} >
            <Balance fontSize={balanceFontSize} value={withdrawTimeLeft} decimals={0} unit={`  days`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default WithdrawTimeLeft
