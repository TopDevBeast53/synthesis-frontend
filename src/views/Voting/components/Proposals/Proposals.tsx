import React, { useEffect } from 'react'
import { Card, Flex, Heading } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import orderBy from 'lodash/orderBy'
import { useAppDispatch } from 'state'
import { fetchProposals } from 'state/voting'
import { useGetProposalLoadingStatus, useGetProposals } from 'state/voting/hooks'
import { ProposalState, ProposalType } from 'state/types'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { filterProposalsByState, filterProposalsByType } from '../../helpers'
import ProposalsLoading from './ProposalsLoading'

import ProposalRow from './ProposalRow'

const Proposals = ({ filterState, proposalType }: { filterState: ProposalState; proposalType: ProposalType }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const proposalStatus = useGetProposalLoadingStatus()
  const proposals = useGetProposals()
  const dispatch = useAppDispatch()

  const isLoading = proposalStatus === FetchStatus.Fetching
  const isFetched = proposalStatus === FetchStatus.Fetched

  useEffect(() => {
    dispatch(fetchProposals({ chainId, first: 1000, state: filterState }))
  }, [filterState, dispatch, chainId])

  const filteredProposals = orderBy(filterProposalsByState(filterProposalsByType(proposals, proposalType), filterState), ['end'], ['desc'])

  return (
    <>
      <Card>
        {isLoading && <ProposalsLoading />}
        {isFetched &&
          filteredProposals.length > 0 &&
          filteredProposals.reverse().map((proposal) => {
            return <ProposalRow key={proposal.id} proposal={proposal} />
          })}
        {isFetched && filteredProposals.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Heading as="h5">{t('No proposals found')}</Heading>
          </Flex>
        )}
      </Card>
    </>
  )
}

export default Proposals
