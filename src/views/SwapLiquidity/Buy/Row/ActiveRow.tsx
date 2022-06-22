import React, { useContext, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, useDelayedUnmount, useMatchBreakpoints, useModal } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { StyledRow, MobileRow, ButtonRow, MobileButtonRow, AskingTokenCell, GivingTokenCell, QuestionCell } from 'views/SwapLiquidity/components/Cells/StyledCell'
import TokensCell from 'views/SwapLiquidity/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapLiquidity/components/Cells/ToolTipCell'
import ExpandActionCell from 'views/SwapLiquidity/components/Cells/ExpandActionCell'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'

const ActiveRow = (props) => {
  const { tableRefresh, setTableRefresh } = useContext(SwapLiquidityContext)
  const { account } = useWeb3React()
  const { swapData, seller, buyer } = props
  const [expanded, setExpanded] = useState(false)
  const shouldRenderDetail = useDelayedUnmount(expanded, 300)
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()

  const handleOnRowClick = () => {
    if (!account) return
    setExpanded(!expanded)
  }
  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }
  const [showModal] = useModal(<DiscussOrder swapData={swapData} sendAsk={onSendAsk} buyer={buyer} />, false)

  const handleBid = (e) => {
    e.stopPropagation()
    showModal()
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
            />
          </QuestionCell>
          {
            account && (
              <ButtonRow style={{ zIndex: 10 }}>
                <Button
                  variant="secondary" width="100%" onClick={handleBid} scale={isMobile ? "sm" : "md"}> Bid </Button>
              </ButtonRow>
            )
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
              />
            </QuestionCell>
            <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
          </StyledRow>
          {
            account && (
              <MobileButtonRow style={{ zIndex: 10 }}>
                <Button
                  variant="secondary" width="100%" onClick={handleBid} scale={isMobile ? "sm" : "md"}> Bid </Button>
              </MobileButtonRow>
            )
          }
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

export default ActiveRow
