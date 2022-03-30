import React, { useState } from 'react'
import { Flex, Heading, Button, Card, Text } from 'uikit'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProposalState, ProposalType } from 'state/types'
import { Proposals } from './components/Proposals'
import Page from '../Page'
import Filters from './components/Proposals/Filters'
import TabMenu from './components/Proposals/TabMenu'

const Content = styled.div`
  flex: 1;
  height: 100%;
`

const PageHeading = styled(Heading)`
  font-size: 70px;
  weight: 400;
  line-height: 73.5px;
  padding-bottom: 84px;
`;

const GeneralCard = styled(Card)`
  padding: 14px 29px 15px 29px;
  min-width: 288px;
`

const GeneralCardCaption = styled(Text)`
  color: rgba(249,250,250, 0.5);
  font-size: 18px;
  margin-bottom: 7px;
`

const DisplayPanel = styled(Flex)`
  position: relative;
  flex-direction: column;
  width: 70%;
  max-width: 1200px;
`;

const Voting = () => {

  const [filterState, setFilterState] = useState(ProposalState.ACTIVE)
  const [proposalType, setProposalType] = useState(ProposalType.CORE)

  return (
    <Page>
      <PageHeading>
        Voting
      </PageHeading>

      <DisplayPanel flexDirection="column" minHeight="calc(100vh - 64px)">
        <Flex justifyContent="space-between">
          
          <Flex>
            <GeneralCard style={{ minWidth: "210px", marginLeft: '25px'}}>
              <GeneralCardCaption>
                Filter Proposals by end time
              </GeneralCardCaption>
              <Filters filterState={filterState} onFilterChange={setFilterState} />
            </GeneralCard>

            <GeneralCard style={{ minWidth: "210px", marginLeft: '25px'}}>
              <GeneralCardCaption>
                Filter Proposals by origin
              </GeneralCardCaption>
              <TabMenu proposalType={proposalType} onTypeChange={setProposalType} />
            </GeneralCard>
          </Flex>

          <GeneralCard style={{ minWidth: "210px"}}>
            <GeneralCardCaption>
              Got a suggestion?
            </GeneralCardCaption>
            <Button
              as={Link}
              to="/voting/proposal/create"
              style={{margin: '4px'}}
            >
              Make a Proposal
            </Button>
          </GeneralCard>

        </Flex>

        <Content>
          <Proposals filterState={filterState} proposalType={proposalType}/>
        </Content>

      </DisplayPanel>
    </Page>
  )
}

export default Voting
