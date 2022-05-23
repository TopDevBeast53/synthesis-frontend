import React, { useMemo, useState } from 'react'
import moment from 'moment'
import { AutoRenewIcon, Button, useMatchBreakpoints, Text } from 'uikit'
import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { OrderState } from 'views/SwapYield/types'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from '../../Cells/StyledCell'
import ArrowCell from '../../Cells/ArrowCell'
import ToolTipCell from '../../Cells/ToolTipCell'
import TokenCell from '../../Cells/TokenCell'
import { CellContent } from '../../Cells/BaseCell'

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
        if(swapData.status !== 1) return null
    }        
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()}/>
                </StyledCell>
                <StyledCell style={{flex:isMobile ? "none": "1 1 70px"}}>
                    <CellContent>                   
                        <Text fontSize={isMobile ? "12px": undefined} mt="4px" color="primary">
                            {swapData.status === OrderState.Withdrawn ? "Withdrawn" : !isPast ? 'Now available!' : timeInfo}
                        </Text>
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
                            (swapData.status === OrderState.Completed && !isPast) &&
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
