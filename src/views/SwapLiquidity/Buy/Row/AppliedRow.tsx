import { useHelixLpSwap, useERC20 } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import React, { useContext, useState } from 'react'
import { AutoRenewIcon, Button, useDelayedUnmount, useMatchBreakpoints } from 'uikit'
import handleError from 'utils/handleError'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { StyledRow, MobileRow, ButtonRow, MobileButtonRow, AskingTokenCell, GivingTokenCell, QuestionCell } from 'views/SwapLiquidity/components/Cells/StyledCell'
import TokensCell from 'views/SwapLiquidity/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapLiquidity/components/Cells/ToolTipCell'
import ExpandActionCell from 'views/SwapLiquidity/components/Cells/ExpandActionCell'
import CandidateTable from '../CandidateTable'

const AppliedRow = (props) => {
  const { account } = useWeb3React()
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

  const sellerTokenContract = useERC20(swapData?.toBuyerToken)
  const buyerTokenContract = useERC20(swapData?.toSellerToken)

  async function doValidation() {
    try {
      const sellerBalance = await sellerTokenContract.balanceOf(swapData?.seller)
      if (sellerBalance.lt(swapData?.amount)) {
        toastError('Error', "Creator doesn't have enough offering token amount now")
        setPendingTx(false)
        return false
      }

      const accountBalance = await buyerTokenContract.balanceOf(account)
      if (accountBalance.lt(swapData?.ask)) {
        toastError('Error', "You don't have enough amount of token which creator asks")
        setPendingTx(false)
        return false
      }
    } catch (err) {
      handleError(err, toastError)
      setPendingTx(false)
      return false
    }
    return true
  }

  const handleAcceptClick = async (e) => {
    e.stopPropagation();
    setPendingTx(true)

    if (!(await doValidation())) return

    LpSwapContract.acceptAsk(swapData?.id).then(async (tx) => {
      await tx.wait()
      toastSuccess("Success", "Accepted the asking amount!")
      setTableRefresh(tableRefresh + 1)
      setPendingTx(false)
    }).catch(err => {
      handleError(err, toastError)
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
