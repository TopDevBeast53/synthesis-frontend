import React from 'react'
import { ToolTipText } from 'views/SwapYield/constants'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from '../../Cells/StyledCell'
import ArrowCell from '../../Cells/ArrowCell'
import ExTokenCell from '../../Cells/ExTokenCell'
import LPTokenCell from '../../Cells/LPTokenCell'
import ToolTipCell from '../../Cells/ToolTipCell'

const EarnedRow=({swapData})=>{ 
    if(swapData){
        if(swapData.isOpen === true) return null
    }    
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.lpToken} balance={swapData?.amount.toString()}/>
                </StyledCell>
                <StyledCellWithoutPadding>
                    <ArrowCell/>
                </StyledCellWithoutPadding>                
                <StyledCell>                    
                    <ExTokenCell exTokenAddress={swapData?.exToken} balance={swapData?.ask.toString()}/>                   
                </StyledCell>
                <StyledCell>
                    <ToolTipCell tooltipText={ToolTipText}/>
                </StyledCell>                
            </StyledRow>
        </>
    )
}

export default EarnedRow
