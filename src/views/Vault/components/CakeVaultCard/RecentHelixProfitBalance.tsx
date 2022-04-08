import React from 'react'
import { Text, TooltipText, useTooltip } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

interface RecentHelixProfitBalanceProps {
  auraToDisplay: number
  dollarValueToDisplay: number
  dateStringToDisplay: string
}

const RecentHelixProfitBalance: React.FC<RecentHelixProfitBalanceProps> = ({
  auraToDisplay,
  dollarValueToDisplay,
  dateStringToDisplay,
}) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={auraToDisplay} decimals={3} bold unit=" CAKE" />
      <Balance fontSize="16px" value={dollarValueToDisplay} decimals={2} bold prefix="~$" />
      {t('Earned since your last action')}
      <Text>{dateStringToDisplay}</Text>
    </>,
    {
      placement: 'bottom-end',
    },
  )

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="14px" value={auraToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentHelixProfitBalance
