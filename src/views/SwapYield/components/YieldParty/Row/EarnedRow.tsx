import React from 'react'
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
                <ToolTipCell 
                    buyerToken={swapData?.lpToken} 
                    buyerTokenAmount={swapData?.amount.toString()} 
                    sellerToken={swapData?.exToken} 
                    sellerTokenAmount={swapData?.ask.toString()}
                />
                </StyledCell>                
            </StyledRow>
        </>
    )
}

export default EarnedRow
