import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ChevronDownIcon, useDelayedUnmount } from 'uikit'
import { ToolTipText } from 'views/SwapYield/constants'
import BaseCell from '../../Cells/BaseCell'
import DurationCell from '../../Cells/DurationCells'
import ExTokenCell from '../../Cells/ExTokenCell'
import LPTokenCell from '../../Cells/LPTokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'
import CandidateTable from '../CandidateTable'

const StyledRow = styled.div`
  background-color: transparent;
  
  display: flex;
  cursor: pointer;
`
const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left:32px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`
const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const ActiveRow=(props)=>{
    const YieldSwapContract = useHelixYieldSwap()
    const { toastSuccess, toastError } = useToast()        
    const {swapData, swapId} = props
    const [expanded, setExpanded] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)
    const duration  = useMemo(()=>{
        if(!swapData) return undefined
        return moment.duration(swapData?.lockDuration.toNumber(), "s")
    }, [swapData])
    const handleOnRowClick = () => {
        setExpanded(!expanded)        
    }
    const handleCloseClick = (e) => {
        e.stopPropagation();        
        setPendingTx(true) 
        YieldSwapContract.closeSwap(swapId).then(async (tx)=>{
            await tx.wait()
            toastSuccess("Info", "You closed the Order")
            setPendingTx(false) 
        }).catch(err=>{
            if(err.code === 4001){
                toastError("Error", err.message)    
            }else{
                toastError("Error", err.toString())
            }
            setPendingTx(false) 
        })
    }
  
    if(swapData){
        if(swapData.isOpen === false) return null
    }
    return (
        <>
            <StyledRow onClick={handleOnRowClick}>
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.lpToken} balance={swapData?.amount.toString()}/>
                </StyledCell>
                <StyledCell>
                    <DurationCell duration={duration} />                    
                </StyledCell>
                <StyledCell>
                    <ExTokenCell exTokenAddress={swapData?.exToken} balance={swapData?.ask.toString()}/>                   
                </StyledCell>
                <StyledCell>
                    <ToolTipCell tooltipText={ToolTipText}/>
                </StyledCell>
                <StyledCell style={{zIndex:10, flex:3}}>
                    <Button 
                        isLoading={pendingTx}    
                        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                        color="primary" onClick={handleCloseClick} scale="sm" width="100px"> Close </Button>
                </StyledCell>
                <StyledCell>
                    <ArrowIcon color="primary" toggled={expanded} />
                </StyledCell>
                
            </StyledRow>
        
            {shouldRenderDetail && (
                <div style={{padding:"10px 10px", minHeight:"5em"}}>
                    <CandidateTable swap={swapData}/>
                </div>
            )}        
        
        </>
    )
}

export default ActiveRow;