import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Button, ChevronDownIcon, useDelayedUnmount, useModal } from 'uikit'
import { ToolTipText } from 'views/SwapLiquidity/constants'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import BaseCell from 'views/SwapYield/components/Cells/BaseCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'


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
    const {tableRefresh, setTableRefresh} = useContext(SwapLiquidityContext)
    const {swapData} = props
    const [expanded, setExpanded] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)
    const handleOnRowClick = () => {
        setExpanded(!expanded)        
    }
    const onSendAsk = () =>{
        setTableRefresh(tableRefresh + 1)
    }
    const [showModal] = useModal(<DiscussOrder swapData={swapData} onSend={onSendAsk}/>,false)
   
    return (
        <>
            <StyledRow onClick={handleOnRowClick}>
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toBuyerToken} balance={swapData?.amount.toString()}/>
                </StyledCell>
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toSellerToken} balance={swapData?.ask.toString()}/>                   
                </StyledCell>
                <StyledCell>
                    <ToolTipCell tooltipText={ToolTipText} />
                </StyledCell>
                <StyledCell style={{zIndex:10, flex:3}}>
                    <Button 
                        color="primary" onClick={showModal} scale="sm" width="100px"> Bid </Button>
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