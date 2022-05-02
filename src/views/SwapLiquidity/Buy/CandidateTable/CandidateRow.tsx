import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import Balance from 'components/Balance';
import { useHelixYieldSwap } from 'hooks/useContract';
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import styled from 'styled-components';
import { AutoRenewIcon, Button, Skeleton, Text, useModal } from 'uikit';
import BaseCell, { CellContent } from 'views/SwapYield/components/Cells/BaseCell';
import DiscussOrder from '../Modals/DiscussOrder';
import { SwapState } from '../../types'

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
const CandidateRow=({bidId, exToken})=>{
    const YieldSwapContract = useHelixYieldSwap()
    const {account} = useWeb3React()
    const {tableRefresh, setTableRefresh, filterState} = useContext(SwapLiquidityContext)
    const [bidData, setBidData] = useState<any>()
    const [pendingTx, setPendingTx] = useState(false)
    const onSendAsk = () =>{
        setTableRefresh(tableRefresh + 1)
    }
    const [showModal] = useModal(<DiscussOrder bidData={bidData} bidId={bidId} onSend={onSendAsk} exToken={exToken}/>,false)
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
        <StyledRow>
            <StyledCell>
                <CellContent>
                    <Text>
                        {getEllipsis(bidData?.bidder)}
                    </Text>                    
                </CellContent>
            </StyledCell>
            <StyledCell>
                <CellContent>
                    <Text>
                        YAmount
                    </Text>
                    <Balance
                        mt="4px"                
                        color='primary'                        
                        value={bidData?.amount}
                        fontSize="14px"
                    />
                </CellContent>
            </StyledCell>
            {
                filterState === SwapState.Applied && account === bidData?.bidder && (
                    <StyledCell>
                        <CellContent>
                            <Button 
                                isLoading={pendingTx}    
                                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}  
                                width="100px" 
                                style={{zIndex:20}} 
                                onClick={showModal}> Update </Button>
                        </CellContent>       
                    </StyledCell>
                )
            }
        </StyledRow>
    )
}

export default CandidateRow;