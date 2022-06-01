import React, { useState } from 'react'
import { Flex, Heading, Button, Card, Text, useMatchBreakpoints } from 'uikit'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProposalState, ProposalType } from 'state/types'
import PageHeader from 'components/PageHeader'
import { Proposals } from './components/Proposals'
import Page from '../Page'
import Filters from './components/Proposals/Filters'
import TabMenu from './components/Proposals/TabMenu'

const Content = styled.div`
  flex: 1;
  height: 100%;
  padding:64px 0px;
`

// const PageHeading = styled(Heading)`
//   font-size: 32px;
//   weight: 400;
//   line-height: 73.5px;
//   padding-bottom: 84px;
//   ${({ theme }) => theme.mediaQueries.sm} {
//     text-align:start;
//     font-size: 70px;  
//   }
// `

const GeneralCard = styled(Card)`
  padding: 14px 0px 15px 15px;
  min-width: 288px;
  flex:1;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 14px 29px 15px 29px;
    // flex:none
  }
  ${({ theme }) => theme.mediaQueries.sm} {    
    margin-right:25px;
  }

`

const GeneralCardCaption = styled(Text)`
  color: rgba(249, 250, 250, 0.5);
  font-size: 14px;
  margin-bottom: 7px;
  ${({ theme }) => theme.mediaQueries.sm} {    
    font-size: 18px;
  }
`

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

const Voting = () => {
  const [filterState, setFilterState] = useState(ProposalState.ACTIVE)
  const [proposalType, setProposalType] = useState(ProposalType.ALL)
  const { isTablet } = useMatchBreakpoints()

  return (
    <>
      <PageHeader background="transparent">
        <Heading as="h1" scale="xxl" color="secondary"> 
          Helix Proposals
        </Heading>
        <Heading scale="lg" color="text" mt="3">
          Suggest Improvements, Vote Using the HELIX Token
        </Heading>
      </PageHeader>
      <Page removePadding>      
        <DisplayPanel style={{minHeight:"calc(100vh - 64px)"}}>
          <Flex justifyContent="space-between" flexWrap="wrap">
            <Flex flexWrap="wrap">
              <GeneralCard style={{ minWidth: '330px', marginTop:"15px" }}>
                <GeneralCardCaption>Filter Proposals by end time</GeneralCardCaption>
                <Filters filterState={filterState} onFilterChange={setFilterState} />
              </GeneralCard>

              <GeneralCard style={{ minWidth: '330px', marginTop:"15px" }}>
                <GeneralCardCaption>Filter Proposals by origin</GeneralCardCaption>
                <TabMenu proposalType={proposalType} onTypeChange={setProposalType} />
              </GeneralCard>
            </Flex>

            <GeneralCard style={{ minWidth: '210px', maxWidth:isTablet ? "340px" :"380px", marginTop:"15px" }}>
              <GeneralCardCaption>What&apos;s your suggestion?</GeneralCardCaption>
              <Button as={Link} to="/voting/proposal/create" style={{ margin: '4px' }}>
                Create a Proposal
              </Button>
            </GeneralCard>
          </Flex>

          <Content>
            <Proposals filterState={filterState} proposalType={proposalType} />
          </Content>
        </DisplayPanel>
      </Page>
    </>
  )
}

export default Voting
