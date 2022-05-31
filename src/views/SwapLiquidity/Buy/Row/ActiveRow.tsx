import React, { useContext, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Button, ChevronDownIcon, useDelayedUnmount, useMatchBreakpoints, useModal } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from 'views/SwapYield/components/Cells/StyledCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'
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
    const {swapData, seller, buyer} = props
    const [expanded, setExpanded] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)
    const { isMobile } = useMatchBreakpoints()

    const handleOnRowClick = () => {
        if(!account)    return
        setExpanded(!expanded)        
    }
    const onSendAsk = () =>{
        setTableRefresh(tableRefresh + 1)
    }
    const [showModal] = useModal(<DiscussOrder swapData={swapData} sendAsk={onSendAsk} buyer={buyer}/>,false)    
    
    return (
        <>
            <StyledRow onClick={handleOnRowClick}>
                <StyledCell>
                    <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()} />
                </StyledCell>               
                <StyledCell>
                    <TokensCell token={swapData?.toSellerToken} balance={swapData?.ask.toString()} />
                </StyledCell>
                <StyledCellWithoutPadding>
                    <ToolTipCell 
                        seller={seller}             
                        buyer={buyer} 
                        askAmount={swapData?.ask.toString()}
                        isLiquidity
                    />
                </StyledCellWithoutPadding>
                {
                    account && (
                        <StyledCell style={{zIndex:10}} ml="8px" mr="8px">
                            <Button 
                                color="primary" onClick={showModal} scale={isMobile?"sm":"md"} maxWidth="100px"> Bid </Button>
                        </StyledCell>
                    )
                }
                {
                    !isMobile &&                    
                    <StyledCellWithoutPadding>
                        <ArrowIcon color="primary" toggled={expanded} />                    
                    </StyledCellWithoutPadding>
                }
                
                
            </StyledRow>
        
            {shouldRenderDetail && (
                <div style={{padding:"10px 10px", minHeight:"5em"}}>
                    <CandidateTable swap={swapData} buyer={buyer}/>
                </div>
            )}        
        
        </>
    )
}

export default ActiveRow
