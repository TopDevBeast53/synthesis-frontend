import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useContext, useState } from 'react'
import { AutoRenewIcon, Button, useDelayedUnmount, useMatchBreakpoints, useModal } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { StyledRow, MobileRow, ButtonRow, MobileButtonColumnCell, AskingTokenCell, GivingTokenCell, QuestionCell } from 'views/SwapYield/components/Cells/StyledCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'
import ExpandActionCell from 'views/SwapYield/components/Cells/ExpandActionCell'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'

const ActiveRow = (props) => {
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const { swapData, swapId, seller, buyer } = props
  const [expanded, setExpanded] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const shouldRenderDetail = useDelayedUnmount(expanded, 300)
  const { setTableRefresh, tableRefresh } = useContext(SwapLiquidityContext)
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()

  const handleOnRowClick = () => {
    setExpanded(!expanded)
  }
  const handleCloseClick = (e) => {
    e.stopPropagation();
    setPendingTx(true)
    LpSwapContract.closeSwap(swapId).then(async (tx) => {
      await tx.wait()
      toastSuccess("Info", "You closed the Order")
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
  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }
  const [showDiscussModal] = useModal(<DiscussOrder swapId={swapId} sendAsk={onSendAsk} swapData={swapData} buyer={buyer} />, false)
  const handleUpdateClick = (e) => {
    e.stopPropagation();
    showDiscussModal()
  }
  if (swapData) {
    if (swapData.isOpen === false) return null
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
          {
            swapData &&
            <ButtonRow style={{ zIndex: 10, flexDirection: "row" }}>
              <Button
                variant="secondary" onClick={handleUpdateClick} scale={isMobile ? "sm" : "md"} width="100%" mr="8px"> Update Ask </Button>
              <Button
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                variant="secondary" onClick={handleCloseClick} scale={isMobile ? "sm" : "md"} width="100%"> Close </Button>
            </ButtonRow>

          }
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
          {
            swapData &&
            <MobileButtonColumnCell style={{ zIndex: 10 }}>
              <Button
                variant="secondary" onClick={handleUpdateClick} scale={isMobile ? "sm" : "md"} width="100%" mr="8px"> Update Ask </Button>
              <Button
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                variant="secondary" onClick={handleCloseClick} scale={isMobile ? "sm" : "md"} width="100%"> Close </Button>
            </MobileButtonColumnCell>
          }
        </MobileRow>
      }
      {shouldRenderDetail && (
        <div style={{ padding: "10px 10px", minHeight: "5em" }}>
          <CandidateTable swap={swapData} />
        </div>
      )}
    </>
  )
}

export default ActiveRow
