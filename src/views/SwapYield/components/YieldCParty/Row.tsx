import { useTranslation } from 'contexts/Localization'
import { useHelixYieldSwap, useERC20 } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useToast from 'hooks/useToast'
import moment from 'moment'
import React, { useContext, useMemo, useState } from 'react'
import { AutoRenewIcon, Button, Skeleton, Text, useDelayedUnmount, useMatchBreakpoints, useModal } from 'uikit'
import { YieldCPartyContext } from 'views/SwapYield/context'
import handleError from 'utils/handleError'
import { SwapState } from '../../types'
import { StyledRow, MobileRow, ButtonRow, MobileButtonRow, AskingTokenCell, LeftTimeCell, GivingTokenCell, QuestionCell, SkeletonCell } from '../Cells/StyledCell'
import ExpandActionCell from '../Cells/ExpandActionCell'
import ToolTipCell from '../Cells/ToolTipCell'
import TokenCell from '../Cells/TokenCell'
import { CellContent } from './BaseCell'
import CandidateTable from './CandidateTable'
import DiscussOrder from './DiscussOrder'

const YieldCPartyRow = ({ data, state, loading }) => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const { id, lockDuration, bidIds, lockUntilTimestamp, buyer, seller, ask } = data
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()
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
        timeInfo: (moment.duration(lockDuration.toNumber(), 's').humanize()).replace(/a /g, '1 '),
        isPast: today.isBefore(withdrawDate),
      }
      // eslint-disable-next-line no-else-return
    } else if (state === SwapState.Pending) {
      return {
        timeInfo: (moment.duration(today.diff(withdrawDate)).humanize()).replace(/a /g, '1 '),
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
    <DiscussOrder swapId={id} tokenInfo={buyer} amount={ask} onSend={onSendAsk} />,
    false,
  )

  const handleExpand = () => {
    if (state === SwapState.Finished || state === SwapState.Pending) return
    setExpanded(!expanded)
  }

  const handleBid = (e) => {
    e.stopPropagation()
    showModal()
  }

  const sellerTokenContract = useERC20(seller?.token)
  const buyerTokenContract = useERC20(buyer?.token)

  async function doValidation() {
    try {
      const sellerBalance = await sellerTokenContract.balanceOf(seller?.party)
      if (sellerBalance.lt(seller?.amount)) {
        toastError('Error', "Creator doesn't have enough offering token amount now")
        setPendingTx(false)
        return false
      }

      const accountBalance = await buyerTokenContract.balanceOf(account)
      if (accountBalance.lt(ask)) {
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

  const handleAcceptAsk = async (e) => {
    e.stopPropagation()
    setPendingTx(true)

    if (!(await doValidation())) return

    try {
      const tx = await yieldSwapContract.acceptAsk(id)
      await tx.wait()
      updateMenuIndex(SwapState.Pending)
      onSendAsk()
      setPendingTx(false)
      toastSuccess(`${t('Success')}!`, t('Accepted the asking amount!'))
    } catch (err) {
      handleError(err, toastError)
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
      toastSuccess(`${t('Success')}`, t('Collected Successfully!'))
    } catch (err) {
      handleError(err, toastError)
      setPendingTx(false)
    }
  }

  if (loading) {
    return (
      <StyledRow>
        <SkeletonCell>
          <Skeleton />
        </SkeletonCell>
        <SkeletonCell>
          <Skeleton />
        </SkeletonCell>
        <SkeletonCell>
          <Skeleton />
        </SkeletonCell>
      </StyledRow>
    )
  }

  return (
    <>
      {!isMobile ?
        <StyledRow onClick={handleExpand}>
          <GivingTokenCell>
            <TokenCell tokenInfo={seller} amount={seller.amount.toString()} />
          </GivingTokenCell>
          {state !== SwapState.Finished && (
            <LeftTimeCell>
              <CellContent>
                <Text>{(state === SwapState.All || state === SwapState.Applied) ? "Duration" : "Left Time"}</Text>
                <Text fontSize={isMobile ? "12px" : undefined} mt="4px" color="primary">
                  {!isPast && state === SwapState.Pending ? 'Now available!' : timeInfo}
                </Text>
              </CellContent>
            </LeftTimeCell>
          )}
          <AskingTokenCell>
            <TokenCell tokenInfo={buyer}
              amount={
                (state === SwapState.Pending || state === SwapState.Finished) ?
                  data?.buyer.amount.toString()
                  :
                  data?.ask.toString()
              }
            />
          </AskingTokenCell>

          <QuestionCell>
            <ToolTipCell
              chainId={chainId}
              seller={seller}
              buyer={buyer}
              askAmount={(state === SwapState.Pending || state === SwapState.Finished) ?
                data?.buyer.amount.toString()
                :
                data?.ask.toString()}
            />
          </QuestionCell>
          <ButtonRow style={{ zIndex: 10 }}>
            {state === SwapState.All && (
              <Button variant="secondary" width="100%" scale={isMobile ? "sm" : "md"} onClick={handleBid}>
                Bid
              </Button>
            )}
            {state === SwapState.Applied && (
              <Button
                variant="secondary"
                width="100%"
                scale={isMobile ? "sm" : "md"}
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                onClick={handleAcceptAsk}
              >
                Accept Ask
              </Button>
            )}

            {state === SwapState.Pending && !isPast && (
              <Button
                variant="secondary"
                width="100%"
                scale={isMobile ? "sm" : "md"}
                isLoading={pendingTx}
                mr="24px"
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                onClick={handleWithdraw}
              >
                Collect
              </Button>
            )}
          </ButtonRow>
          {(state === SwapState.All || state === SwapState.Applied) && (
            <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
          )}
        </StyledRow>
        :
        <MobileRow>
          <StyledRow onClick={handleExpand}>
            <GivingTokenCell>
              <TokenCell tokenInfo={seller} amount={seller.amount.toString()} />
            </GivingTokenCell>
            {state !== SwapState.Finished && (
              <LeftTimeCell>
                <CellContent>
                  <Text>{(state === SwapState.All || state === SwapState.Applied) ? "Duration" : "Left Time"}</Text>
                  <Text fontSize={isMobile ? "12px" : undefined} mt="4px" color="primary">
                    {!isPast && state === SwapState.Pending ? 'Now available!' : timeInfo}
                  </Text>
                </CellContent>
              </LeftTimeCell>
            )}
            <AskingTokenCell>
              <TokenCell tokenInfo={buyer}
                amount={
                  (state === SwapState.Pending || state === SwapState.Finished) ?
                    data?.buyer.amount.toString()
                    :
                    data?.ask.toString()
                }
              />
            </AskingTokenCell>

            <QuestionCell>
              <ToolTipCell
                chainId={chainId}
                seller={seller}
                buyer={buyer}
                askAmount={(state === SwapState.Pending || state === SwapState.Finished) ?
                  data?.buyer.amount.toString()
                  :
                  data?.ask.toString()}
              />
            </QuestionCell>
            {(state === SwapState.All || state === SwapState.Applied) && (
              <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
            )}
          </StyledRow>
          {state !== SwapState.Finished &&

            <MobileButtonRow style={{ zIndex: 10 }}>
              {state === SwapState.All && (
                <Button variant="secondary" width="100%" scale={isMobile ? "sm" : "md"} onClick={handleBid}>
                  Bid
                </Button>
              )}
              {state === SwapState.Applied && (
                <Button
                  variant="secondary"
                  width="100%"
                  scale={isMobile ? "sm" : "md"}
                  isLoading={pendingTx}
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                  onClick={handleAcceptAsk}
                >
                  Accept Ask
                </Button>
              )}

              {state === SwapState.Pending && !isPast && (
                <Button
                  variant="secondary"
                  width="100%"
                  scale={isMobile ? "sm" : "md"}
                  isLoading={pendingTx}
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                  onClick={handleWithdraw}
                >
                  Collect
                </Button>
              )}
            </MobileButtonRow>
          }
        </MobileRow>
      }

      {shouldRenderDetail && account && (
        <div style={{ padding: '10px 10px', minHeight: '5em' }}>
          <CandidateTable bids={bidIds} exToken={buyer} exAmount={ask.toString()} />
        </div>
      )}
    </>
  )
}

export default YieldCPartyRow
