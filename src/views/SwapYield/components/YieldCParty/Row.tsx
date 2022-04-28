import React from 'react'
import Balance from 'components/Balance'
import styled from 'styled-components'
import { Text, Button, useModal } from 'uikit'
import { useHelixYieldSwap } from 'hooks/useContract'
import moment from 'moment'
import BaseCell, { CellContent } from './BaseCell'
import DiscussOrder from './DiscussOrder'
import { SwapState } from '../../types'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`
const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left:32px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const YieldCPartyRow=({data})=>{
    const {amount, ask, lockUntilTimestamp, state} = data
    const dueDate = moment.unix(lockUntilTimestamp)
    const today = moment()    
    const duration = moment.duration(dueDate.diff(today))
    const yieldSwapContract = useHelixYieldSwap();

    const [showModal] = useModal(<DiscussOrder/>,false)

    const handleWithdraw = () => {
        yieldSwapContract.withdraw(0)
    }

    moment.duration(dueDate.diff(today))
    return (
        <StyledRow>
            <StyledCell>
                <CellContent>
                    <Text>
                        YAmount
                    </Text>
                    <Balance
                        mt="4px"                
                        color='primary'                        
                        value={amount}
                        fontSize="14px"
                    />
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
                        value={ask}
                        fontSize="14px"
                    />
                </CellContent>
            </StyledCell>
            <StyledCell>
                <CellContent>
                    <Text>
                        Left Time
                    </Text>
                    <Text mt="4px" color='primary'>
                        {duration.humanize()}
                    </Text>
                </CellContent>
            </StyledCell>
            <StyledCell>
                <CellContent>
                {
                    state === SwapState.All && (
                        <Button variant="secondary" scale="md" mr="8px" onClick={showModal}> Send Offer </Button>
                    )
                }

                {
                    state === SwapState.Pending && (
                        <Button variant="secondary" scale="md" mr="8px" onClick={handleWithdraw}> Collect </Button>
                    )
                }
                </CellContent>
            </StyledCell>
        </StyledRow>
    )
}

export default YieldCPartyRow;