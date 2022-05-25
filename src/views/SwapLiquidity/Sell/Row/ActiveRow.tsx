import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ChevronDownIcon, useDelayedUnmount, useMatchBreakpoints, useModal } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import { StyledCell, StyledCellWithoutPadding, StyledRow } from 'views/SwapYield/components/Cells/StyledCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const ActiveRow = (props) => {
    const LpSwapContract = useHelixLpSwap()
    const { toastSuccess, toastError } = useToast()
    const { swapData, swapId, seller, buyer } = props
    const [expanded, setExpanded] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)
    const { setTableRefresh, tableRefresh } = useContext(SwapLiquidityContext)
    const { isMobile } = useMatchBreakpoints()
    
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
    const [showDiscussModal] = useModal(<DiscussOrder swapId={swapId} sendAsk={onSendAsk} swapData={swapData} buyer={buyer}/>,false)
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
                    <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()}/>
                </StyledCell>
                {/* <StyledCellWithoutPadding>
                    <ArrowCell/>
                </StyledCellWithoutPadding>                 */}
                <StyledCell>                    
                    <TokensCell token={swapData?.toSellerToken} balance={swapData?.ask.toString()}/>
                </StyledCell>
                <StyledCellWithoutPadding>
                    <ToolTipCell 
                        seller={seller}             
                        buyer={buyer} 
                        askAmount={swapData?.ask.toString()}
                        isLiquidity
                    />
                </StyledCellWithoutPadding>

                <StyledCell style={{zIndex:10, flexDirection:"row"}}>
                    <Button                         
                        color="primary" onClick={handleUpdateClick} scale="sm" width="100px" ml="15px"> Update </Button>
                    <Button                         
                        isLoading={pendingTx}    
                        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                        ml="15px"
                        color="primary" onClick={handleCloseClick} scale="sm" width="100px"> Close </Button>
                </StyledCell>
                {
                    !isMobile &&
                    <StyledCellWithoutPadding>
                        <ArrowIcon color="primary" toggled={expanded} />
                    </StyledCellWithoutPadding>
                }
            </StyledRow>
        
            {shouldRenderDetail && (
                <div style={{padding:"10px 10px", minHeight:"5em"}}>
                    <CandidateTable swap={swapData}/>
                </div>
            )}        
        
        </>
    )
}

export default ActiveRow
