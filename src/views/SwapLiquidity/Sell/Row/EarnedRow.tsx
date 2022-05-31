import React from 'react'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from 'views/SwapYield/components/Cells/StyledCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'

const EarnedRow=({swapData, seller, buyer})=>{ 
    if(swapData){
        if(swapData.isOpen === true || swapData?.cost.isZero()) return null
    }    
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()}/>
                </StyledCell>  
                <StyledCell>                    
                    <TokensCell token={swapData?.toSellerToken} balance={swapData?.cost.toString()}/>                   
                </StyledCell>
                <StyledCellWithoutPadding>
                <ToolTipCell 
                    seller={seller}             
                    buyer={buyer} 
                    askAmount={swapData?.cost.toString()}
                    isLiquidity
                />
                </StyledCellWithoutPadding>                
            </StyledRow>
        </>
    )
}

export default EarnedRow
