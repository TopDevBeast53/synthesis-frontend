import React from 'react'
import { StyledRow, StyledCell, StyledCellWithoutPadding } from '../../Cells/StyledCell'
import ArrowCell from '../../Cells/ArrowCell'
import ToolTipCell from '../../Cells/ToolTipCell'
import TokenCell from '../../Cells/TokenCell'

const EarnedRow=({swapData})=>{ 
    if(swapData){
        if(swapData.isOpen === true) return null
    }    
    return (
        <>
            <StyledRow>
                <StyledCell>
                    <TokenCell swapData={swapData} tokenInfo={swapData?.seller}/>                    
                </StyledCell>
                <StyledCellWithoutPadding>
                    <ArrowCell/>
                </StyledCellWithoutPadding>                
                <StyledCell>                    
                    <TokenCell swapData={swapData} tokenInfo={swapData?.buyer}/>
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
