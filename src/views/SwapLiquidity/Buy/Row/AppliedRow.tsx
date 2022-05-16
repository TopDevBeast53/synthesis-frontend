import React, { useContext, useState } from 'react'
import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ChevronDownIcon, useDelayedUnmount } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from 'views/SwapYield/components/Cells/StyledCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'
import CandidateTable from '../CandidateTable'

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const AppliedRow=(props)=>{
    const LpSwapContract = useHelixLpSwap()
    const {tableRefresh, setTableRefresh} = useContext(SwapLiquidityContext)
    const { toastSuccess, toastError } = useToast()        
    const {swapData} = props
    const [expanded, setExpanded] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)
    const handleOnRowClick = () => {
        setExpanded(!expanded)        
    }
    const handleAcceptClick = (e) => {
        e.stopPropagation();        
        setPendingTx(true) 
        LpSwapContract.acceptAsk(swapData?.id).then(async (tx)=>{
            await tx.wait()
            toastSuccess("Info", "Bid success!")
            setTableRefresh(tableRefresh + 1)
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
   
    return (
        <>
            <StyledRow onClick={handleOnRowClick}>
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toBuyerToken} balance={swapData?.amount.toString()}/>
                </StyledCell>               
                <StyledCellWithoutPadding>
                    <ArrowCell back/>
                </StyledCellWithoutPadding> 
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toSellerToken} balance={swapData?.ask.toString()}/>                   
                </StyledCell>
                <StyledCellWithoutPadding>
                <ToolTipCell 
                    seller={swapData?.seller}             
                    buyer={swapData?.buyer} 
                    askAmount={swapData?.ask.toString()}
                />
                </StyledCellWithoutPadding>
                <StyledCell style={{zIndex:10, flex:3}}>
                    <Button 
                        isLoading={pendingTx}    
                        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                        color="primary" onClick={handleAcceptClick} scale="sm" width="100px"> Accept </Button>
                </StyledCell>
                <StyledCellWithoutPadding>
                    <ArrowIcon color="primary" toggled={expanded} />
                </StyledCellWithoutPadding>
                
            </StyledRow>
        
            {shouldRenderDetail && (
                <div style={{padding:"10px 10px", minHeight:"5em"}}>
                    <CandidateTable swap={swapData}/>
                </div>
            )}        
        
        </>
    )
}

export default AppliedRow
