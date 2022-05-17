import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import moment from 'moment'
import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ChevronDownIcon, Skeleton, Text, useDelayedUnmount, useModal } from 'uikit'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import ExTokenCell from 'views/SwapYield/components/Cells/ExTokenCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'
import { YieldCPartyContext } from 'views/SwapYield/context'
import { SwapState } from '../../types'
import { StyledCell, StyledCellWithoutPadding, StyledRow } from '../Cells/StyledCell'
import { CellContent } from './BaseCell'
import CandidateTable from './CandidateTable'
import DiscussOrder from './DiscussOrder'

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const YieldCPartyRow = ({ data, state, loading }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { amount, ask, id, exToken, lpToken, lockDuration, lockUntilTimestamp, approved, bids } = data
  const yieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const shouldRenderDetail = useDelayedUnmount(expanded, 300)
  const { tableRefresh, setTableRefresh, updateMenuIndex } = useContext(YieldCPartyContext)
  const { timeInfo, isPast } = useMemo(() => {
    const withdrawDate = moment.unix(lockUntilTimestamp)
    const today = moment()
    if (state === SwapState.All || state === SwapState.Applied) {
      return {
        timeInfo: moment.duration(lockDuration.toNumber(), 's').humanize(),
        isPast: today.isBefore(withdrawDate),
      }
      // eslint-disable-next-line no-else-return
    } else if (state === SwapState.Pending) {
      return {
        timeInfo: moment.duration(today.diff(withdrawDate)).humanize(),
        isPast: today.isBefore(withdrawDate),
      }
    }

    return {
      timeInfo: '',
      isPast: false,
    }
  }, [lockDuration, lockUntilTimestamp, state])

  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }

  const [showModal] = useModal(
    <DiscussOrder swapId={id} exToken={exToken} exAmount={ask} approved={approved} onSend={onSendAsk} />,
    false,
  )

  const handleExpand = () => {
    setExpanded(!expanded)
  }

  const handleBid = (e) => {
    e.stopPropagation()
    showModal()
  }

  const handleAcceptAsk = async (e) => {
    e.stopPropagation()
    setPendingTx(true)
    try {
      const tx = await yieldSwapContract.acceptAsk(id)
      await tx.wait()
      updateMenuIndex(SwapState.Pending)
      onSendAsk()
      setPendingTx(false)
      toastSuccess(`${t('Success')}!`, t('Accepted! '))
    } catch (err) {
      toastError('Error', 'Update bid failed!')
      setPendingTx(false)
    }
  }

  const handleWithdraw = async (e) => {
    e.stopPropagation()
    setPendingTx(true)
    try {
      const tx = await yieldSwapContract.withdraw(id)
      await tx.wait()
      setPendingTx(false)
      onSendAsk()
      toastSuccess(`${t('Success')}!`, t('Withdraw Success!!! '))
    } catch (err) {
      toastError('Error', 'Withdraw locked!')
      setPendingTx(false)
    }
  }

  if (loading) {
    return (
      <StyledRow>
        <StyledCell>
          <CellContent>
            <Text>UAmount</Text>
            <Skeleton mt="4px" />
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            <Text>YAmount</Text>
            <Skeleton mt="4px" />
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            <Text>Duration</Text>
            <Skeleton mt="4px" />
          </CellContent>
        </StyledCell>
      </StyledRow>
    )
  }

  return (
    <>
      <StyledRow onClick={handleExpand}>
        <StyledCell>
          <LPTokenCell lpTokenAddress={lpToken} balance={amount.toString()} />
        </StyledCell>

        {state !== SwapState.Finished && (
          <StyledCell>
            <CellContent>
              {state === SwapState.Pending && <Text>Left Time</Text>}
              <Text mt="4px" color="primary">
                {!isPast && state === SwapState.Pending ? 'Now available!' : timeInfo}
              </Text>
            </CellContent>
          </StyledCell>
        )}
        <StyledCellWithoutPadding>
          <ArrowCell back />
        </StyledCellWithoutPadding>
        <StyledCell>
          <ExTokenCell exTokenAddress={exToken} balance={ask.toString()} />
        </StyledCell>

        <StyledCell>
        {/* <ToolTipCell 
            buyerToken={lpToken} 
            buyerTokenAmount={amount.toString()} 
            sellerToken={exToken} 
            sellerTokenAmount={ask.toString()}
        /> */}
        </StyledCell>
        <StyledCell style={{ zIndex: 10, flex: 3 }}>
          <CellContent>
            {state === SwapState.All && (
              <Button variant="secondary" scale="md" mr="8px" onClick={handleBid}>
                {' '}
                Bid{' '}
              </Button>
            )}
            {state === SwapState.Applied && (
              <Button
                variant="secondary"
                scale="md"
                mr="8px"
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                onClick={handleAcceptAsk}
              >
                {' '}
                Accept Ask{' '}
              </Button>
            )}

            {state === SwapState.Pending && !isPast && (
              <Button
                variant="secondary"
                scale="md"
                mr="8px"
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                onClick={handleWithdraw}
              >
                {' '}
                Collect{' '}
              </Button>
            )}
          </CellContent>
        </StyledCell>
        {(state === SwapState.All || state === SwapState.Applied) && (
          <StyledCell>
            <ArrowIcon color="primary" toggled={expanded} onClick={handleExpand} />
          </StyledCell>
        )}
      </StyledRow>

      {shouldRenderDetail && account && (
        <div style={{ padding: '10px 10px', minHeight: '5em' }}>
          <CandidateTable bids={bids} exToken={exToken} approved={approved} exAmount={ask} />
        </div>
      )}
    </>
  )
}

export default YieldCPartyRow
