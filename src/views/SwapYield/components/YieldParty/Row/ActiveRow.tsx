import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import moment from 'moment'
import React, { useContext, useMemo, useState } from 'react'
import { AutoRenewIcon, Button, useDelayedUnmount, useMatchBreakpoints, useModal } from 'uikit'
import handleError from 'utils/handleError'
import { YieldPartyContext } from 'views/SwapYield/context'
import DurationCell from '../../Cells/DurationCells'
import { StyledRow, MobileRow, ButtonRow, MobileButtonRow, AskingTokenCell, LeftTimeCell, GivingTokenCell, QuestionCell } from '../../Cells/StyledCell'
import TokenCell from '../../Cells/TokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'
import ExpandActionCell from '../../Cells/ExpandActionCell'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'

const ActiveRow = (props) => {
  const YieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const { tableRefresh, setTableRefresh } = useContext(YieldPartyContext)
  const { swapData, swapId } = props
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()

  const [expanded, setExpanded] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const shouldRenderDetail = useDelayedUnmount(expanded, 300)
  const duration = useMemo(() => {
    if (!swapData) return undefined
    return moment.duration(swapData?.lockDuration.toNumber(), 's')
  }, [swapData])
  const handleOnRowClick = () => {
    setExpanded(!expanded)
  }
  const handleCloseClick = (e) => {
    e.stopPropagation()
    setPendingTx(true)
    YieldSwapContract.closeSwap(swapId)
      .then(async (tx) => {
        await tx.wait()
        toastSuccess('Info', 'You closed the Order')
        setPendingTx(false)
      })
      .catch((err) => {
        handleError(err, toastError)
        setPendingTx(false)
      })
  }

  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }
  const [showDiscussModal] = useModal(<DiscussOrder swapId={swapId} onSend={onSendAsk} swapData={swapData} />, false)

  const handleUpdateClick = (e) => {
    e.stopPropagation()
    showDiscussModal()
  }
  if (swapData) {
    if (swapData.status !== 0) return null
  }

  return (
    <>
      {!isMobile ?
        <StyledRow onClick={handleOnRowClick}>
          <GivingTokenCell>
            <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()} />
          </GivingTokenCell>
          <LeftTimeCell>
            <DurationCell duration={duration} />
          </LeftTimeCell>
          <AskingTokenCell>
            <TokenCell tokenInfo={swapData?.buyer} amount={swapData?.ask.toString()} />
          </AskingTokenCell>
          <QuestionCell>
            <ToolTipCell
              seller={swapData?.seller}
              buyer={swapData?.buyer}
              askAmount={swapData?.ask.toString()}
            />
          </QuestionCell>
          {
            swapData &&
            <ButtonRow style={{ zIndex: 10 }}>
              <Button variant="secondary" onClick={handleUpdateClick} scale={isMobile ? "sm" : "md"} width="100%" mr="8px">
                Update Ask
              </Button>
              <Button
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                variant="secondary"
                onClick={handleCloseClick}
                scale={isMobile ? "sm" : "md"}
                width="100%"
              >
                Close
              </Button>
            </ButtonRow>
          }
          <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
        </StyledRow>
        :
        <MobileRow>
          <StyledRow onClick={handleOnRowClick}>
            <GivingTokenCell>
              <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()} />
            </GivingTokenCell>
            <LeftTimeCell>
              <DurationCell duration={duration} />
            </LeftTimeCell>
            <AskingTokenCell>
              <TokenCell tokenInfo={swapData?.buyer} amount={swapData?.ask.toString()} />
            </AskingTokenCell>
            <QuestionCell>
              <ToolTipCell
                seller={swapData?.seller}
                buyer={swapData?.buyer}
                askAmount={swapData?.ask.toString()}
              />
            </QuestionCell>
            <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
          </StyledRow>
          {
            swapData &&
            <MobileButtonRow style={{ zIndex: 10 }}>
              <Button variant="secondary" onClick={handleUpdateClick} scale={isMobile ? "sm" : "md"} width="100%" mr="8px">
                Update Ask
              </Button>
              <Button
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                variant="secondary"
                onClick={handleCloseClick}
                scale={isMobile ? "sm" : "md"}
                width="100%"
              >
                Close
              </Button>
            </MobileButtonRow>
          }
        </MobileRow>
      }

      {shouldRenderDetail && (
        <div style={{ padding: '10px', minHeight: '5em' }}>
          <CandidateTable swap={swapData} />
        </div>
      )}
    </>
  )
}

export default ActiveRow
