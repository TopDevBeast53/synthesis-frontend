import React from 'react'
import { Text, useMatchBreakpoints } from 'uikit'
import { DeserializedPool } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import Apr from '../Apr'
import { convertSharesToAura } from '../../../helpers'

interface AprCellProps {
  pool: DeserializedPool
}

const AutoAprCell: React.FC<AprCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const {
    userData: { userShares },
    fees: { performanceFeeAsDecimal },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)

  const { auraAsBigNumber } = convertSharesToAura(userShares, pricePerFullShare)

  return (
    <BaseCell role="cell" flex={['1 0 50px', '1 0 50px', '2 0 100px', '2 0 100px', '1 0 120px']}>
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('APY')}
        </Text>
        <Apr
          pool={pool}
          stakedBalance={auraAsBigNumber}
          performanceFee={performanceFeeAsDecimal}
          showIcon={!isMobile}
        />
      </CellContent>
    </BaseCell>
  )
}

export default AutoAprCell
