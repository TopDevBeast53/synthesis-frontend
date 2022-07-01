import React from 'react'
import { Text, TooltipText, useTooltip } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

interface RecentHelixProfitBalanceProps {
  helixToDisplay: number
  dollarValueToDisplay: number
  dateStringToDisplay: string
}

const RecentHelixProfitBalance: React.FC<RecentHelixProfitBalanceProps> = ({
  helixToDisplay,
  dollarValueToDisplay,
  dateStringToDisplay,
}) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={helixToDisplay} decimals={3} bold unit=" HELIX" />
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
        <Balance fontSize="14px" value={helixToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentHelixProfitBalance
