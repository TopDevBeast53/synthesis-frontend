import React from 'react'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from '../../Cells/StyledCell'
import ArrowCell from '../../Cells/ArrowCell'
import ToolTipCell from '../../Cells/ToolTipCell'
import TokenCell from '../../Cells/TokenCell'

const EarnedRow=({swapData})=>{ 
    if(swapData){
        if(swapData.status !== 1) return null
    }    
    console.log(swapData)
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()}/>
                </StyledCell>
                <StyledCellWithoutPadding>
                    <ArrowCell/>
                </StyledCellWithoutPadding>                
                <StyledCell>                    
                    <TokenCell tokenInfo={swapData?.buyer} amount={swapData?.ask.toString()}/>
                </StyledCell>
                <StyledCell>
                <ToolTipCell 
                    seller={swapData?.seller}             
                    buyer={swapData?.buyer} 
                    askAmount={swapData?.ask.toString()}
                />
                </StyledCell>                
            </StyledRow>
        </>
    )
}

export default EarnedRow
