import React, { useRef } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { Button, ChevronUpIcon, Text } from 'uikit'
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
const YieldCPartyTable = ({ swaps, state, loading }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const tableWrapperEl = useRef<HTMLDivElement>(null)

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {!loading && swaps.length === 0 && (
          <StyledRow>
            <StyledCol>
              <Text>No Data</Text>
            </StyledCol>
          </StyledRow>
        )}
        {swaps.map((data) => (
          <YieldCPartyRow key={data.id} data={data} state={state} loading={loading} />
        ))}
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            { account ? t('To Top') : t('Connect Your Wallet to See Swap Orders')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default YieldCPartyTable
