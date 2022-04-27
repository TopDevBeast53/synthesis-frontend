import React, { useMemo } from 'react'
import Balance from 'components/Balance'
import styled from 'styled-components'
import { Text } from 'uikit'
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

const YieldPartyRow=({data})=>{
    const {uamount, yamount, dueTimeStamp} = data
    const {duration, isPast} = useMemo(()=>{
        const dueDate = moment.unix(dueTimeStamp) 
        const today = moment()    
        const retData = { 
            duration: moment.duration(dueDate.diff(today)) , 
            isPast: dueDate.isSameOrBefore(today)
        }
        return retData        
    },[dueTimeStamp])
    
    return (
        <StyledRow>
            <StyledCell>
                <CellContent>
                    <Text>
                        UAmount
                    </Text>
                    <Balance
                        mt="4px"                
                        color='primary'                        
                        value={uamount}
                        fontSize="14px"
                    />
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
                        value={yamount}
                        fontSize="14px"
                    />
                </CellContent>
            </StyledCell>
            <StyledCell>
                <CellContent>
                    <Text>
                        Duration
                    </Text>
                    <Text color="primary" mt="4px">
                        {duration.humanize()}
                    </Text>                    
                </CellContent>       
            </StyledCell>
        </StyledRow>
    )
}

export default YieldPartyRow;