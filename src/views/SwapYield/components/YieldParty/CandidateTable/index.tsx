import React, { useRef, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { Button, ChevronUpIcon, useModal } from 'uikit'
import { CandidateData } from 'views/SwapYield/dummy'
import CandidateRow from './CandidateRow'
import DiscussOrder from '../DiscussOrder'


const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  scroll-margin-top: 64px;

  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`


// background-color: ${({ theme }) => theme.colors.cardBorder};

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


const CandidateTable = (props) => {
    const { theme } = useTheme()
    const { t } = useTranslation()
    const {onDismiss} = props
    const tableWrapperEl = useRef<HTMLDivElement>(null)
    const scrollToTop = (): void => {
      tableWrapperEl.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
    const data =CandidateData
    const [showModal] = useModal(<DiscussOrder/>,false)
    const handleRowClick = () =>{
        alert("candidate row select")
    }
    return (
      <StyledTableBorder>
        <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>        
          {
            data.map((item)=>(
              <CandidateRow key={item.id} data={item} onClick={showModal}/>
            ))
          }
          {/* <ScrollButtonContainer>
            <Button variant="text" onClick={scrollToTop}>
              {t('To Top')}
              <ChevronUpIcon color="primary" />
            </Button>
          </ScrollButtonContainer> */}
        </StyledTable>
      </StyledTableBorder>
    )
}
export default CandidateTable