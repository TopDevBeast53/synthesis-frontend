import React from 'react'
import styled from 'styled-components'
import { ToolTipText } from 'views/SwapYield/constants'
import BaseCell from '../../Cells/BaseCell'
import ArrowCell from '../../Cells/ArrowCell'
import ExTokenCell from '../../Cells/ExTokenCell'
import LPTokenCell from '../../Cells/LPTokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'


const StyledRow = styled.div`
  background-color: transparent;
  align-items:center;
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
                    <LPTokenCell lpTokenAddress={swapData?.lpToken} balance={swapData.amount.toString()}/>
                </StyledCell>
                <StyledCell>
                    <ArrowCell/>
                </StyledCell>                
                <StyledCell>                    
                    <ExTokenCell exTokenAddress={swapData?.exToken} balance={swapData.ask.toString()}/>                   
                </StyledCell>
                <StyledCell>
                    <ToolTipCell tooltipText={ToolTipText}/>
                </StyledCell>                
            </StyledRow>
        </>
    )
}

export default EarnedRow;