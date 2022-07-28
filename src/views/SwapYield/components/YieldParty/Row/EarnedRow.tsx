import { useHelixYieldSwap } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useToast from 'hooks/useToast'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { AutoRenewIcon, Button, Skeleton, Text, useMatchBreakpoints } from 'uikit'
import { OrderState } from 'views/SwapYield/types'
import handleError from 'utils/handleError'
import { CellContent } from '../../Cells/BaseCell'
import { StyledRow, MobileRow, ButtonRow, MobileButtonRow, AskingTokenCell, LeftTimeCell, GivingTokenCell, QuestionCell } from '../../Cells/StyledCell'
import TokenCell from '../../Cells/TokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'

const EarnedRow = ({ swapData, swapId }) => {
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const yieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { timeInfo, isPast } = useMemo(() => {
    if (!swapData) {
      return {
        timeInfo: '',
        isPast: false,
      }
    }
    const withdrawDate = moment.unix(swapData.lockUntilTimestamp)
    const today = moment()
    return {
      timeInfo: (moment.duration(today.diff(withdrawDate)).humanize()).replace(/a /g, '1 '),
      isPast: today.isBefore(withdrawDate),
    }
  }, [swapData])
  const handleWithdraw = async (e) => {
    e.stopPropagation()
    setPendingTx(true)
    try {
      const tx = await yieldSwapContract.withdraw(swapId)
      await tx.wait()
      setPendingTx(false)
      toastSuccess('Success', 'Collected Successfully!')
    } catch (err) {
      handleError(err, toastError)
      setPendingTx(false)
    }
  }
  if (swapData) {
    if (swapData.status === 0 || swapData?.buyer.amount.isZero()) return null
  }
  return (
    <>
      {!isMobile ?
        <StyledRow>
          <GivingTokenCell>
            <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()} />
          </GivingTokenCell>
          <LeftTimeCell>
            <CellContent>
              {
                swapData ?
                  <>
                    <Text>Left Time</Text>
                    <Text fontSize={isMobile ? "12px" : undefined} mt="4px" color="primary">
                      {swapData?.status === OrderState.Withdrawn ? "Withdrawn" : !isPast ? 'Now available!' : timeInfo}
                    </Text>
                  </>
                  :
                  <>
                    <Skeleton />
                    <Skeleton mt="4" />
                  </>
              }
            </CellContent>
          </LeftTimeCell>
          <AskingTokenCell>
            <TokenCell tokenInfo={swapData?.buyer} amount={swapData?.buyer.amount.toString()} />
          </AskingTokenCell>
          <QuestionCell>
            <ToolTipCell
              chainId={chainId}
              seller={swapData?.seller}
              buyer={swapData?.buyer}
              askAmount={swapData?.buyer.amount.toString()}
            />
          </QuestionCell>
          <ButtonRow style={{ paddingRight: "32px" }}>
            {swapData?.status !== OrderState.Withdrawn &&
              <Button
                variant={(swapData?.status === OrderState.Completed && !isPast) ? "secondary" : "primary"}
                width="100%"
                scale={isMobile ? "sm" : "md"}
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                onClick={handleWithdraw}
                disabled={!(swapData?.status === OrderState.Completed && !isPast)}
              >
                Collect
              </Button>
            }
          </ButtonRow>
        </StyledRow>
        :
        <MobileRow>
          <StyledRow>
            <GivingTokenCell>
              <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()} />
            </GivingTokenCell>
            <LeftTimeCell>
              <CellContent>
                {
                  swapData ?
                    <>
                      <Text>Left Time</Text>
                      <Text fontSize={isMobile ? "12px" : undefined} mt="4px" color="primary">
                        {swapData?.status === OrderState.Withdrawn ? "Withdrawn" : !isPast ? 'Now available!' : timeInfo}
                      </Text>
                    </>
                    :
                    <>
                      <Skeleton />
                      <Skeleton mt="4" />
                    </>
                }
              </CellContent>
            </LeftTimeCell>
            <AskingTokenCell>
              <TokenCell tokenInfo={swapData?.buyer} amount={swapData?.buyer.amount.toString()} />
            </AskingTokenCell>
            <QuestionCell>
              <ToolTipCell
                chainId={chainId}
                seller={swapData?.seller}
                buyer={swapData?.buyer}
                askAmount={swapData?.buyer.amount.toString()}
              />
            </QuestionCell>
          </StyledRow>
          {swapData?.status !== OrderState.Withdrawn &&
            <MobileButtonRow>
              <Button
                variant={(swapData?.status === OrderState.Completed && !isPast) ? "secondary" : "primary"}
                width="100%"
                scale={isMobile ? "sm" : "md"}
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                onClick={handleWithdraw}
                disabled={!(swapData?.status === OrderState.Completed && !isPast)}
              >
                Collect
              </Button>
            </MobileButtonRow>
          }
        </MobileRow>
      }
    </>
  )
}

export default EarnedRow
