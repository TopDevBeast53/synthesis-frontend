import React, { useMemo, useState } from 'react'
import Balance from 'components/Balance'
import styled from 'styled-components'
import { Text, ChevronDownIcon, useDelayedUnmount } from 'uikit'
import moment from 'moment'
import BaseCell, { CellContent } from './BaseCell'
import CandidateTable from './CandidateTable'

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
const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`
const YieldPartyRow=({data, onClick})=>{
    const {uamount, yamount, dueTimeStamp} = data
    const [expanded, setExpanded] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)
    const {duration, isPast} = useMemo(()=>{
        const dueDate = moment.unix(dueTimeStamp) 
        const today = moment()    
        const retData = { 
            duration: moment.duration(dueDate.diff(today)) , 
            isPast: dueDate.isSameOrBefore(today)
        }
        return retData        
    },[dueTimeStamp])
    const handleOnRowClick = () => {
        setExpanded(!expanded)
        if(onClick) onClick()
    }
    return (
        <>
        <StyledRow onClick={handleOnRowClick}>
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
            <StyledCell>
                <ArrowIcon color="primary" toggled={expanded} />
            </StyledCell>
        </StyledRow>
        
            {shouldRenderDetail && (
                <div style={{padding:"10px 10px"}}>
                    <CandidateTable/>
                </div>
            )}        
        
        </>
    )
}

export default YieldPartyRow;