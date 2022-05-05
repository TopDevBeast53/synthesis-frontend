import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ChevronDownIcon, useDelayedUnmount, useModal } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from 'views/SwapYield/components/Cells/StyledCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'
import { ToolTipText } from '../../constants'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const ActiveRow=(props)=>{
    const LpSwapContract = useHelixLpSwap()
    const { toastSuccess, toastError } = useToast()        
    const {swapData, swapId} = props
    const [expanded, setExpanded] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)
    const {setTableRefresh, tableRefresh} = useContext(SwapLiquidityContext)

    const handleOnRowClick = () => {
        setExpanded(!expanded)        
    }
    const handleCloseClick = (e) => {
        e.stopPropagation();        
        setPendingTx(true) 
        LpSwapContract.closeSwap(swapId).then(async (tx)=>{
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
    const onSendAsk = () =>{
        setTableRefresh(tableRefresh + 1)
    }
    const [showDiscussModal] = useModal(<DiscussOrder swapId={swapId} onSend={onSendAsk} swapData={swapData}/>,false)
    const handleUpdateClick = (e) => {
        e.stopPropagation();
        showDiscussModal()
    }
    if(swapData){
        if(swapData.isOpen === false) return null
    }
    return (
        <>
            <StyledRow onClick={handleOnRowClick}>
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toBuyerToken} balance={swapData?.amount.toString()}/>
                </StyledCell>
                <StyledCellWithoutPadding>
                    <ArrowCell/>
                </StyledCellWithoutPadding>                
                <StyledCell>                    
                    <LPTokenCell lpTokenAddress={swapData?.toSellerToken} balance={swapData?.ask.toString()}/>
                </StyledCell>
                <StyledCell>
                    <ToolTipCell tooltipText={ToolTipText}/>
                </StyledCell>
                <StyledCell>
                    <Button                         
                        color="primary" onClick={handleUpdateClick} scale="sm" width="100px"> Update </Button>
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