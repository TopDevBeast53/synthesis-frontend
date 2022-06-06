import React from 'react'
import { Price } from 'sdk'
import { Text, AutoRenewIcon, useTooltip } from 'uikit'
import { StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? Number(price?.toSignificant(6)) < 0.000001 ? "<0.000001" : parseFloat(price?.toFixed(6)) : Number(price?.invert()?.toSignificant(6)) < 0.000001 ? "<0.000001" : parseFloat(price?.invert()?.toFixed(6))
  const { targetRef, tooltip, tooltipVisible } = useTooltip('Flip Rate', { placement: 'right-end', trigger: 'hover' })

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  return (
    <Text style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', fontSize: '14px' }}>
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          {tooltipVisible && tooltip}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)} ref={targetRef} >
            <AutoRenewIcon width="14px" />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
