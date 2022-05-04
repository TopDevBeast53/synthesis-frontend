import React from 'react'
import styled from 'styled-components'
import { ToolTipText } from 'views/SwapLiquidity/constants'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import BaseCell from 'views/SwapYield/components/Cells/BaseCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'



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

const EarnedRow=({swapData})=>{ 
    if(swapData){
        if(swapData.isOpen === true) return null
    }    
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toBuyerToken} balance={swapData.amount.toString()}/>
                </StyledCell>  
                <StyledCell style={{flex:"0", padding:"0px", alignSelf:"center"}}>
                    <ArrowCell/>
                </StyledCell>               
                <StyledCell>                    
                    <LPTokenCell lpTokenAddress={swapData?.toSellerToken} balance={swapData.ask.toString()}/>                   
                </StyledCell>
                <StyledCell>
                    <ToolTipCell tooltipText={ToolTipText}/>
                </StyledCell>                
            </StyledRow>
        </>
    )
}

export default EarnedRow;