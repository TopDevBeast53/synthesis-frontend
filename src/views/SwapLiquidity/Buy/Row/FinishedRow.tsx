import React from 'react'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from 'views/SwapYield/components/Cells/StyledCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'

const FinishedRow=({swapData})=>{ 
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()}/>
                </StyledCell>               
                <StyledCellWithoutPadding>
                    <ArrowCell back/>
                </StyledCellWithoutPadding> 
                <StyledCell>
                    <TokensCell token={swapData?.toSellerToken} balance={swapData?.ask.toString()}/>                   
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
