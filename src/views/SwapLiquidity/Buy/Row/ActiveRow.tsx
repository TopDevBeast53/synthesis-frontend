import React, { useContext, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Button, ChevronDownIcon, useDelayedUnmount, useModal } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from 'views/SwapYield/components/Cells/StyledCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'
import CandidateTable from '../CandidateTable'
import DiscussOrder from '../Modals/DiscussOrder'

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const ActiveRow=(props)=>{
    const {tableRefresh, setTableRefresh} = useContext(SwapLiquidityContext)
    const { account } = useWeb3React()
    const {swapData} = props
    const [expanded, setExpanded] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)
    const handleOnRowClick = () => {
        if(!account)    return
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
                <StyledCellWithoutPadding>
                    <ArrowCell back/>
                </StyledCellWithoutPadding> 
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toSellerToken} balance={swapData?.ask.toString()}/>                   
                </StyledCell>
                <StyledCellWithoutPadding>
                    <ToolTipCell 
                        buyerToken={swapData?.toBuyerToken} 
                        buyerTokenAmount={swapData?.amount.toString()} 
                        sellerToken={swapData?.toSellerToken} 
                        sellerTokenAmount={swapData?.ask.toString()}
                    />
                </StyledCellWithoutPadding>
                {
                    account && (
                        <StyledCell style={{zIndex:10}}>
                            <Button 
                                color="primary" onClick={showModal} scale="sm" width="100px"> Bid </Button>
                        </StyledCell>
                    )
                }
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

export default ActiveRow
