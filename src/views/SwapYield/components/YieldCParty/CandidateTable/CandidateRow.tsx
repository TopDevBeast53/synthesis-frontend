import Balance from 'components/Balance';
import { useWeb3React } from '@web3-react/core'
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AutoRenewIcon, Button, Skeleton, Text, useModal } from 'uikit';
import { YieldCPartyContext } from 'views/SwapYield/context';
import BaseCell, { CellContent } from '../BaseCell';
import DiscussOrder from '../DiscussOrder';

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
const CandidateRow=({bid, exToken, approved})=>{
    const { account } = useWeb3React()  
    const {tableRefresh, setTableRefresh} = useContext(YieldCPartyContext)
    const [pendingTx, setPendingTx] = useState(false)
    
    const onSendAsk = () =>{
        setTableRefresh(tableRefresh + 1)
    }

    const [showModal] = useModal(<DiscussOrder bid={bid}  onSend={onSendAsk} exToken={exToken} approved={approved}/>,false)
    if (!bid){
        return (<StyledRow >
            <StyledCell>
                <CellContent>
                    <Skeleton/>
                </CellContent>
            </StyledCell>
            <StyledCell>
                <CellContent>
                    <Text>
                        DAmount
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
                        {getEllipsis(bid.bidder)}
                    </Text>                    
                </CellContent>
            </StyledCell>
            <StyledCell>
                <CellContent>
                    <Text>
                        DAmount
                    </Text>
                    <Balance
                        mt="4px"                
                        color='primary'                        
                        value={bid.amount}
                        fontSize="14px"
                    />
                </CellContent>
            </StyledCell>
            <StyledCell>
                <CellContent>
                    {
                        account === bid.bidder && (
                            <Button 
                                isLoading={pendingTx}    
                                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}  
                                width="100px" 
                                style={{zIndex:20}} 
                                onClick={showModal}> Update </Button>
                        )
                    }
                </CellContent>       
            </StyledCell>
        </StyledRow>
    )
}

export default CandidateRow;