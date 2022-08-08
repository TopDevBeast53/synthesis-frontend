import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowForwardIcon, Box, IconButton, Flex, Text } from 'uikit'
import styled from 'styled-components'
import { Proposal } from 'state/types'
import { CHAIN_IDS_TO_NAMES } from 'config/constants/networks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { isCoreProposal } from '../../helpers'
import TimeFrame from './TimeFrame'
import { ProposalStateTag, ProposalTypeTag } from './tags'

interface ProposalRowProps {
  proposal: Proposal
}

const StyledProposalRow = styled(Link)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`

const ProposalRow: React.FC<ProposalRowProps> = ({ proposal }) => {
  const votingLink = `/voting/proposal/${proposal.id}`
  const { chainId } = useActiveWeb3React()

  return (
    <StyledProposalRow to={{ pathname: votingLink, search: `chain=${CHAIN_IDS_TO_NAMES[chainId]}` }}>
      <Box as="span" style={{ flex: 1 }}>
        <Text bold mb="8px">
          {proposal.title}
        </Text>
        <Flex alignItems="center" mb="8px">
          <TimeFrame startDate={proposal.start} endDate={proposal.end} proposalState={proposal.state} />
        </Flex>
        <Flex alignItems="center">
          <ProposalStateTag proposalState={proposal.state} />
          <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
        </Flex>
      </Box>
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

export default ProposalRow
