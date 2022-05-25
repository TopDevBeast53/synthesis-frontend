import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import moment from 'moment'
import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ChevronDownIcon, useDelayedUnmount, useMatchBreakpoints, useModal } from 'uikit'
import { YieldPartyContext } from 'views/SwapYield/context'
import DurationCell from '../../Cells/DurationCells'
import { StyledCell, StyledCellWithoutPadding, StyledRow } from '../../Cells/StyledCell'
import TokenCell from '../../Cells/TokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const ActiveRow = (props) => {
  const YieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const { tableRefresh, setTableRefresh } = useContext(YieldPartyContext)
  const { swapData, swapId } = props
  const {isMobile} = useMatchBreakpoints()

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
        if (err.code === 4001) {
          toastError('Error', err.message)
        } else {
          toastError('Error', err.toString())
        }
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
      <StyledRow onClick={handleOnRowClick}>
        <StyledCell style={{flex:isMobile ? "1": "3 1 10px"}}>
          <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()}/>          
        </StyledCell>
        <StyledCell style={{flex:isMobile ? "none": "1 1 70px"}}> 
          <DurationCell duration={duration} />
        </StyledCell>
        {/* <StyledCellWithoutPadding>
          <ArrowCell />
        </StyledCellWithoutPadding> */}
        <StyledCell style={{flex:isMobile ? "1": "3 1 130px"}}>
          <TokenCell tokenInfo={swapData?.buyer} amount={swapData?.ask.toString()}/>          
        </StyledCell>
        <StyledCellWithoutPadding>
          <ToolTipCell 
            seller={swapData?.seller}
            buyer={swapData?.buyer} 
            askAmount={swapData?.ask.toString()}
          />
        </StyledCellWithoutPadding>
        <StyledCell style={{flexDirection:"row"}}>
          <Button color="primary" onClick={handleUpdateClick} scale="sm" width="100px" ml="15px">
            {' '}
            Update{' '}
          </Button>
          <Button
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            color="primary"
            onClick={handleCloseClick}
            scale="sm"
            width="100px"
            ml="15px"
          >
            {' '}
            Close{' '}
          </Button>
        </StyledCell>
        {
          !isMobile &&
          <StyledCell>
            <ArrowIcon color="primary" toggled={expanded} />
          </StyledCell>
        }        
      </StyledRow>

      {shouldRenderDetail && (
        <div style={{ padding: '10px 10px', minHeight: '5em' }}>
          <CandidateTable swap={swapData} />
        </div>
      )}
    </>
  )
}

export default ActiveRow
