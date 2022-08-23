import React from 'react'
import styled from 'styled-components'
import PageHeader from 'components/PageHeader'
import { Flex, Heading } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import Page from '../Page'
import BlockTimeTable from './components/BlockTimeTable'
import AllocPoints from './components/AllocPoints'

const DisplayPanel = styled.div`
  position: relative;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  padding-left: 12px;
  padding-right: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }
  margin-bottom: 32px;
`

export const CardsContainer = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0;
  gap: 1em;
  margin-top: 0.5em;

  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const Admin = () => {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader background="transparent">
        <Heading as="h1" scale="xxl" color="secondary">
          {t('Helix Admin Panel')}
        </Heading>
        {/* <Heading scale="lg" color="text" mt="3">
          Suggest Improvements, Vote Using the HELIX Token
        </Heading> */}
      </PageHeader>
      <Page removePadding>
        <DisplayPanel style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Heading scale="lg" color="text" mt="4">
            {t('Configurations')}
          </Heading>
          <CardsContainer>
            <BlockTimeTable />
          </CardsContainer>
          <Heading scale="lg" color="text" mt="4">
            {t('Allocation Points')}
          </Heading>
          <CardsContainer>
            <AllocPoints />
          </CardsContainer>
        </DisplayPanel>
      </Page>
    </>
  )
}

export default Admin
