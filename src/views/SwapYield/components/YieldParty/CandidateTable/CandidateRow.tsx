import Balance from 'components/Balance';
import { useHelixYieldSwap } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AutoRenewIcon, Button, Skeleton, Text, useModal } from 'uikit';
import { YieldPartyContext } from 'views/SwapYield/context';
import BaseCell, { CellContent } from '../../Cells/BaseCell';
import ExTokenCell from '../../Cells/ExTokenCell';
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
    const YieldSwapContract = useHelixYieldSwap()
    const { toastSuccess, toastError } = useToast()
    const [bidData, setBidData] = useState<any>()
    const {tableRefresh, setTableRefresh} = useContext(YieldPartyContext)
    const [pendingTx, setPendingTx] = useState(false)
    const handleAcceptClick = (e) => {        
        e.stopPropagation();
        setPendingTx(true)
        YieldSwapContract.acceptBid(bidId).then(async (tx)=>{
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
    const [showModal] = useModal(<DiscussOrder bidData={bidData} onSend={onSendAsk}/>,false)
    useEffect(()=>{
        setBidData({bidder:"0x59201fb8cb2D61118B280c8542127331DD141654", amount:20 })
        YieldSwapContract.getBid(bidId).then(res=>{
            setBidData(res)
        })
    }, [YieldSwapContract, bidId])
    if (!bidData){
        return (<StyledRow >
            <StyledCell>
                <CellContent>
                    <Skeleton/>
                </CellContent>
            </StyledCell>
            <StyledCell>
                <CellContent>
                    <Text>
                        YAmount
                    </Text>
                    <Skeleton mt="4px"/>
                </CellContent>
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
                <ExTokenCell exTokenAddress={swapData?.exToken} balance={bidData?.amount}/>
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