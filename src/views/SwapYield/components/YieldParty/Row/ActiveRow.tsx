import React, { useContext, useMemo, useState } from 'react'
import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useFarms } from 'state/farms/hooks'
import moment from 'moment'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ChevronDownIcon, useDelayedUnmount, useModal } from 'uikit'
import { getAddress } from 'utils/addressHelpers'
import { YieldPartyContext } from 'views/SwapYield/context'
import ArrowCell from '../../Cells/ArrowCell'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from '../../Cells/StyledCell'
import DurationCell from '../../Cells/DurationCells'
import ExTokenCell from '../../Cells/ExTokenCell'
import LPTokenCell from '../../Cells/LPTokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const ActiveRow = (props) => {
  const YieldSwapContract = useHelixYieldSwap()
  const { data: farms } = useFarms()
  const { toastSuccess, toastError } = useToast()
  const { tableRefresh, setTableRefresh } = useContext(YieldPartyContext)
  const { swapData, swapId } = props

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
    if (swapData.isOpen === false) return null
  }
  return (
    <>
      <StyledRow onClick={handleOnRowClick}>
        <StyledCell>
          <LPTokenCell lpTokenAddress={swapData?.lpToken} balance={swapData?.amount.toString()} />
        </StyledCell>
        <StyledCell>
          <DurationCell duration={duration} />
        </StyledCell>
        <StyledCellWithoutPadding>
          <ArrowCell />
        </StyledCellWithoutPadding>
        <StyledCell>
          <ExTokenCell exTokenAddress={swapData?.exToken} balance={swapData?.ask.toString()} />
        </StyledCell>
        <StyledCell>
          <ToolTipCell 
            buyerToken={swapData?.lpToken} 
            buyerTokenAmount={swapData?.amount.toString()} 
            sellerToken={swapData?.exToken} 
            sellerTokenAmount={swapData?.ask.toString()}
          />
        </StyledCell>
        <StyledCell>
          <Button color="primary" onClick={handleUpdateClick} scale="sm" width="100px">
            {' '}
            Update{' '}
          </Button>
        </StyledCell>
        <StyledCell style={{ zIndex: 10, flex: 3 }}>
          <Button
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            color="primary"
            onClick={handleCloseClick}
            scale="sm"
            width="100px"
          >
            {' '}
            Close{' '}
          </Button>
        </StyledCell>
        <StyledCell>
          <ArrowIcon color="primary" toggled={expanded} />
        </StyledCell>
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
