import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button, ChevronUpIcon, Text, Skeleton } from 'uikit'
import BaseCell, { CellContent } from './BaseCell'
import YieldCPartyRow from './Row'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  scroll-margin-top: 64px;

  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`
const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  justify-content: center;
  cursor: pointer;
`
const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left:32px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background: rgba(249, 250, 250, 0.08);
  backdrop-filter: blur(80px);
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const StyledCol = styled.div`
  padding-top: 10px;
  padding-bottom: 5px;
  font-style: italic;
` 
const YieldCPartyTable= ({ swaps, state, bids, loading }) => {
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const rowData = swaps.map(s => {
    const filteredBids = s.bidIds.map(i => bids[i.toNumber()])
    return {...s, bids: filteredBids}
  })

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  
  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {
          loading && (
            <>
                <StyledRow >
                  <StyledCell>
                      <CellContent>
                          <Text>
                              UAmount
                          </Text>
                          <Skeleton mt="4px"/>
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
                  <StyledCell>
                      <CellContent>
                          <Text>
                              Duration
                          </Text>
                          <Skeleton mt="4px"/>
                      </CellContent>       
                  </StyledCell>
                    
                </StyledRow>
            </>        
          )
        }
        {
          !loading && rowData.length === 0 && (
            <StyledRow>
              <StyledCol>
                <Text>
                  No Data
                </Text>
              </StyledCol>
            </StyledRow>
          )
        }
        {
          rowData.map((data)=>(
            <YieldCPartyRow key={data.id} data={data} state={state}/>
          ))
        }
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default YieldCPartyTable
