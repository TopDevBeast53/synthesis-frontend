import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useContext, useState } from 'react'
import { AutoRenewIcon, Button, useDelayedUnmount, useMatchBreakpoints } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { StyledRow, MobileRow, ButtonRow, MobileButtonRow, AskingTokenCell, GivingTokenCell, QuestionCell } from 'views/SwapYield/components/Cells/StyledCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'
import ExpandActionCell from 'views/SwapYield/components/Cells/ExpandActionCell'
import CandidateTable from '../CandidateTable'

const AppliedRow = (props) => {
  const LpSwapContract = useHelixLpSwap()
  const { tableRefresh, setTableRefresh } = useContext(SwapLiquidityContext)
  const { toastSuccess, toastError } = useToast()
  const { swapData, seller, buyer } = props
  const [expanded, setExpanded] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const shouldRenderDetail = useDelayedUnmount(expanded, 300)
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()
  const handleOnRowClick = () => {
    setExpanded(!expanded)
  }
  const handleAcceptClick = (e) => {
    e.stopPropagation();
    setPendingTx(true)
    LpSwapContract.acceptAsk(swapData?.id).then(async (tx) => {
      await tx.wait()
      toastSuccess("Info", "Bid success!")
      setTableRefresh(tableRefresh + 1)
      setPendingTx(false)
    }).catch(err => {
      if (err.code === 4001) {
        toastError("Error", err.message)
      } else {
        toastError("Error", err.toString())
      }
      setPendingTx(false)
    })
  }

  return (
    <>
      {!isMobile ?
        <StyledRow onClick={handleOnRowClick}>
          <GivingTokenCell>
            <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()} />
          </GivingTokenCell>
          <AskingTokenCell>
            <TokensCell token={swapData?.toSellerToken} balance={swapData?.ask.toString()} />
          </AskingTokenCell>
          <QuestionCell>
            <ToolTipCell
              seller={seller}
              buyer={buyer}
              askAmount={swapData?.ask.toString()}
              isLiquidity
            />
          </QuestionCell>
          <ButtonRow style={{ zIndex: 10 }}>
            <Button
              isLoading={pendingTx}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              variant="secondary" width="100%" onClick={handleAcceptClick} scale={isMobile ? "sm" : "md"}> Accept Ask </Button>
          </ButtonRow>
          <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
        </StyledRow>
        :
        <MobileRow>
          <StyledRow onClick={handleOnRowClick}>
            <GivingTokenCell>
              <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()} />
            </GivingTokenCell>
            <AskingTokenCell>
              <TokensCell token={swapData?.toSellerToken} balance={swapData?.ask.toString()} />
            </AskingTokenCell>
            <QuestionCell>
              <ToolTipCell
                seller={seller}
                buyer={buyer}
                askAmount={swapData?.ask.toString()}
                isLiquidity
              />
            </QuestionCell>
            <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
          </StyledRow>
          <MobileButtonRow style={{ zIndex: 10 }}>
            <Button
              isLoading={pendingTx}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              variant="secondary" width="100%" onClick={handleAcceptClick} scale={isMobile ? "sm" : "md"}> Accept Ask </Button>
          </MobileButtonRow>
        </MobileRow>
      }
      {shouldRenderDetail && (
        <div style={{ padding: "10px", minHeight: "5em" }}>
          <CandidateTable swap={swapData} buyer={buyer} />
        </div>
      )}

    </>
  )
}

export default AppliedRow
