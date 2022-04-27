import React from 'react'
import Balance from 'components/Balance'
import styled from 'styled-components'
import { Text, Button } from 'uikit'
import moment from 'moment'
import BaseCell, { CellContent } from './BaseCell'

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
    const {yamount, damount, leftTime, state} = data
    const dueDate = moment.unix(leftTime)
    const today = moment()    
    const duration = moment.duration(dueDate.diff(today))

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
                        value={yamount}
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
                        value={damount}
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
                        state === 0 && (
                            <Button variant="secondary" scale="md" mr="8px"> Send Offer </Button>
                        )
                    }

                    {
                        state === 3 && (
                            <Button variant="secondary" scale="md" mr="8px"> Collect </Button>
                        )
                    }
                </CellContent>
            </StyledCell>
        </StyledRow>
    )
}

export default YieldCPartyRow;