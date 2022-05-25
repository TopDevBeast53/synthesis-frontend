import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { AutoRenewIcon, Button, Skeleton, Text, useMatchBreakpoints } from 'uikit'
import { OrderState } from 'views/SwapYield/types'
import { CellContent } from '../../Cells/BaseCell'
import { StyledCell, StyledRow } from '../../Cells/StyledCell'
import TokenCell from '../../Cells/TokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'

const EarnedRow=({swapData, swapId})=>{ 
    const {isMobile} = useMatchBreakpoints()
    const yieldSwapContract = useHelixYieldSwap()
    const { toastSuccess, toastError } = useToast()
    const [pendingTx, setPendingTx] = useState(false)    
    const { timeInfo, isPast } = useMemo(() => {
        if(!swapData){
            return {
                timeInfo: '',
                isPast: false,
            }
        }
        const withdrawDate = moment.unix(swapData.lockUntilTimestamp)
        const today = moment()       
        return {
            timeInfo: moment.duration(today.diff(withdrawDate)).humanize(),
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
          toastSuccess('Success!', 'Collect Success!')
        } catch (err) {
          toastError('Error', 'Withdraw locked!')
          setPendingTx(false)
        }
      }
    if(swapData){
        if(swapData.status === 0 || swapData?.buyer.amount.isZero()) return null
    }     
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()}/>
                </StyledCell>
                <StyledCell style={{flex:isMobile ? "none": "1 1 70px"}}>
                    <CellContent>
                        {
                            swapData?
                                <Text fontSize={isMobile ? "12px": undefined} mt="4px" color="primary">
                                    {swapData?.status === OrderState.Withdrawn ? "Withdrawn" : !isPast ? 'Now available!' : timeInfo}
                                </Text>
                            :
                            <Skeleton/>
                        }                   
                    </CellContent>
                </StyledCell>
                {/* <StyledCellWithoutPadding>
                    <ArrowCell/>
                </StyledCellWithoutPadding>                 */}
                <StyledCell>                    
                    <TokenCell tokenInfo={swapData?.buyer} amount={swapData?.buyer.amount.toString()}/>
                </StyledCell>
                <StyledCell>
                    <ToolTipCell 
                        seller={swapData?.seller}             
                        buyer={swapData?.buyer} 
                        askAmount={swapData?.buyer.amount.toString()}
                    />
                </StyledCell>                
                    <StyledCell style={{ zIndex: 10, flex:isMobile ? "None": "1" }} ml="8px">
                        <CellContent>
                        {
                            (swapData?.status === OrderState.Completed && !isPast) &&
                                    <Button
                                        variant="secondary"
                                        scale={isMobile?"sm":"md"}
                                        
                                        mr="8px"
                                        isLoading={pendingTx}
                                        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                                        onClick={handleWithdraw}
                                    >
                                        {' '}
                                        Collect{' '}
                                    </Button>
                            }
                        </CellContent>
                    </StyledCell>

            </StyledRow>
        </>
    )
}

export default EarnedRow
