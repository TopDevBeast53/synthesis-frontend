import React from 'react'
import ArrowCell from 'views/SwapYield/components/Cells/ArrowCell'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from 'views/SwapYield/components/Cells/StyledCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'
import ToolTipCell from 'views/SwapYield/components/Cells/ToolTipCell'

const EarnedRow=({swapData, seller, buyer})=>{ 
    if(swapData){
        if(swapData.isOpen === true) return null
    }    
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()}/>
                </StyledCell>  
                {/* <StyledCellWithoutPadding style={{flex:"0", alignSelf:"center"}}>
                    <ArrowCell/>
                </StyledCellWithoutPadding>                */}
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
