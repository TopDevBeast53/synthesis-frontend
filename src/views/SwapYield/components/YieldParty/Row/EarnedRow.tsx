import React from 'react'
import styled from 'styled-components'
import { ToolTipText } from 'views/SwapYield/constants'
import BaseCell from '../../Cells/BaseCell'
import ExTokenCell from '../../Cells/ExTokenCell'
import LPTokenCell from '../../Cells/LPTokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'


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
                    <LPTokenCell lpTokenAddress={swapData?.lpToken} balance={swapData.amount.toNumber()}/>
                </StyledCell>                
                <StyledCell>                    
                    <ExTokenCell exTokenAddress={swapData?.exToken} balance={swapData.ask.toNumber()}/>                   
                </StyledCell>
                <StyledCell>
                    <ToolTipCell tooltipText={ToolTipText}/>
                </StyledCell>                
            </StyledRow>
        </>
    )
}

export default EarnedRow;