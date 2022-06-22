import React from 'react'
import { StyledRow, AskingTokenCell, GivingTokenCell, QuestionCell } from 'views/SwapLiquidity/components/Cells/StyledCell'
import TokensCell from 'views/SwapLiquidity/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapLiquidity/components/Cells/ToolTipCell'

const EarnedRow = ({ swapData, seller, buyer }) => {
  if (swapData) {
    if (swapData.isOpen === true || swapData?.cost.isZero()) return null
  }
  return (
    <>
      <StyledRow>
        <GivingTokenCell>
          <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()} />
        </GivingTokenCell>
        <AskingTokenCell>
          <TokensCell token={swapData?.toSellerToken} balance={swapData?.cost.toString()} />
        </AskingTokenCell>
        <QuestionCell>
          <ToolTipCell
            seller={seller}
            buyer={buyer}
            askAmount={swapData?.cost.toString()}
          />
        </QuestionCell>
      </StyledRow>
    </>
  )
}

export default EarnedRow
