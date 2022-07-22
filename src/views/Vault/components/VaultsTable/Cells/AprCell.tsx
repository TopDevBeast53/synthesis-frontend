import React from 'react'
import { Text, useMatchBreakpoints } from 'uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import Apr from '../Apr'

interface AprCellProps {
  stakedBalance: BigNumber,
  apr: number
}

const AprCell: React.FC<AprCellProps> = ({ stakedBalance, apr }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <BaseCell role="cell" flex={['1 0 50px', '1 0 50px', '2 0 100px', '2 0 100px', '1 0 120px']}>
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('APR')}
        </Text>
        <Apr stakedBalance={stakedBalance} showIcon={!isMobile} apr={apr} />
      </CellContent>
    </BaseCell>
  )
}

export default AprCell
