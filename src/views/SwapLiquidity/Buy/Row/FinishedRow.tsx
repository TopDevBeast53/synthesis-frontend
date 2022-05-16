import React from 'react'
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
                <StyledCellWithoutPadding>
                    <ToolTipCell 
                        seller={swapData?.seller}             
                        buyer={swapData?.buyer} 
                        askAmount={swapData?.ask.toString()}
                    />
                </StyledCellWithoutPadding>                
            </StyledRow>
        </>
    )
}

export default FinishedRow
