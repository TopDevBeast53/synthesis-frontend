import React from 'react'
import { ToolTipText } from 'views/SwapLiquidity/constants'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from 'views/SwapYield/components/Cells/StyledCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'

const FinishedRow=({swapData})=>{ 
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toBuyerToken} balance={swapData?.amount.toString()}/>
                </StyledCell>               
                <StyledCellWithoutPadding>
                    <ArrowCell back/>
                </StyledCellWithoutPadding> 
                <StyledCell>
                    <LPTokenCell lpTokenAddress={swapData?.toSellerToken} balance={swapData?.ask.toString()}/>                   
                </StyledCell>
                <StyledCell>
                    <ToolTipCell tooltipText={ToolTipText}/>
                </StyledCell>                
            </StyledRow>
        </>
    )
}

export default FinishedRow;