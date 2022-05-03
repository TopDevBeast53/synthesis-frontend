import { useHelixLpSwap } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AutoRenewIcon, Button, Skeleton, Text, useModal } from 'uikit';
import { SwapLiquidityContext } from 'views/SwapLiquidity/context';
import BaseCell, { CellContent } from 'views/SwapYield/components/Cells/BaseCell';
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell';
import DiscussOrder from '../Modals/DiscussOrder';

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  align-items:center;
  cursor: pointer;
    
`
const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left:32px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`
const getEllipsis = (account) => {
    return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null;
}
const CandidateRow=({bidId, swapData})=>{
    const LpSwapContract = useHelixLpSwap()
    const { toastSuccess, toastError } = useToast()
    const [bidData, setBidData] = useState<any>()
    const {tableRefresh, setTableRefresh} = useContext(SwapLiquidityContext)
    const [pendingTx, setPendingTx] = useState(false)
    const handleAcceptClick = (e) => {        
        e.stopPropagation();
        setPendingTx(true)
        LpSwapContract.acceptBid(bidId).then(async (tx)=>{
            await tx.wait()
            toastSuccess("Success", "You Accepted the Bid")
            setPendingTx(false)
        }).catch(err=>{
            toastError("Error", err.toString())
            setPendingTx(false)
        })        
    }
    const onSendAsk = () =>{
        setTableRefresh(tableRefresh + 1)
    }
    const [showModal] = useModal(<DiscussOrder bidData={bidData} onSend={onSendAsk} swapData={swapData}/>,false)
    useEffect(()=>{        
        LpSwapContract.getBid(bidId).then(res=>{
            console.debug("======== res ========", res, swapData)
            setBidData(res)
        })
    }, [LpSwapContract, bidId, swapData])
    if (!bidData){
        return (<StyledRow >
            <StyledCell>
                <CellContent>
                    <Skeleton/>
                </CellContent>
            </StyledCell>       
            <StyledCell>
                <LPTokenCell />                
            </StyledCell>     
        </StyledRow>)
    }
    return (
        <StyledRow onClick={showModal}>
            <StyledCell>
                <CellContent>
                    <Text>
                        {getEllipsis(bidData?.bidder)}
                    </Text>                    
                </CellContent>
            </StyledCell>
            <StyledCell>
                <LPTokenCell lpTokenAddress={swapData?.toSellerToken} balance={bidData?.amount.toString()}/>                
            </StyledCell>
            <StyledCell>
                <CellContent>
                    <Button 
                        isLoading={pendingTx}    
                        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}  
                        width="100px" 
                        style={{zIndex:20}} 
                        onClick={handleAcceptClick}> Accept </Button>
                </CellContent>       
            </StyledCell>
        </StyledRow>
    )
}

export default CandidateRow;