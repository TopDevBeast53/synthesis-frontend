import React, { useEffect, useState } from 'react'
import { ArrowBackIcon, Box, Button, Flex, Heading } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { Link, useParams } from 'react-router-dom'
import snapshot from '@snapshot-labs/snapshot.js'
import { useAppDispatch } from 'state'
import { ProposalState } from 'state/types'
import {
  useGetProposal,
  useGetVotingStateLoadingStatus,
  useGetVotes,
  useGetProposalLoadingStatus,
} from 'state/voting/hooks'
import { fetchProposal, fetchVotes } from 'state/voting'
import { getAllVotes } from 'state/voting/helpers'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import ReactMarkdown from 'components/ReactMarkdown'
import PageLoader from 'components/Loader/PageLoader'
import { FetchStatus } from 'config/constants/types'
import { useFarms } from 'state/farms/hooks'
import { useFastFresh } from 'hooks/useRefresh'
import useGetChainDetail from 'hooks/useGetChainDetail'
import tokens from 'config/constants/tokens'
import { getAddress, getMasterChefAddress, getHelixAutoPoolAddress, getHelixVaultAddress } from 'utils/addressHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { isCoreProposal } from '../helpers'
import { ProposalStateTag, ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'
import Details from './Details'
import Results from './Results'
import Vote from './Vote'
import Votes from './Votes'
import { PageMeta } from '../../../components/Layout/Page'

const Proposal = () => {
  const fastRefresh = useFastFresh()
  const { id }: { id: string } = useParams()
  const proposal = useGetProposal(id)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const votesGraphql = useGetVotes(id)
  const voteLoadingStatus = useGetVotingStateLoadingStatus()
  const proposalLoadingStatus = useGetProposalLoadingStatus()
  const hasAccountVoted = account && votesGraphql.some((vote) => vote.voter.toLowerCase() === account.toLowerCase())
  const { id: proposalId = null, snapshot: snapshotId = null } = proposal ?? {}
  const isPageLoading = voteLoadingStatus === FetchStatus.Fetching || proposalLoadingStatus === FetchStatus.Fetching
  const { data: farmsLP } = useFarms()
  const { chainId } = useActiveWeb3React()
  const network = useGetChainDetail()
  const [votes, setVotes] = useState([])

  const masterChefAddress = getMasterChefAddress(chainId)
  const autoHelixAddress = getHelixAutoPoolAddress(chainId)
  const vaultAddress = getHelixVaultAddress(chainId)

  useEffect(() => {
    dispatch(fetchProposal(id))
  }, [id, dispatch])

  // We have to wait for the proposal to load before fetching the votes because we need to include the snapshotId
  useEffect(() => {
    if (proposalId && snapshotId) {
      dispatch(fetchVotes({ proposalId, block: Number(snapshotId) }))
    }
  }, [proposalId, snapshotId, dispatch])

  const helixLPs = farmsLP
    .filter((lp) => lp.pid !== 0)
    .filter((lp) => lp.lpSymbol.includes('HELIX'))
    .map((lp) => ({
      "address": getAddress(chainId, lp.lpAddresses),
      "pid": lp.pid
    }))

  const strategies = [{
    "name": "helix",
    "params": {
      "address": `${tokens.helix.address}`,
      "masterChef": `${masterChefAddress}`,
      "autoHelix": `${autoHelixAddress}`,
      "vault": `${vaultAddress}`,
      "helixLPs": helixLPs,
      "symbol": "HELIX",
      "decimals": 18
    }
  }]

  useEffect(() => {
    let mounted = true;

    async function getScore() {
      const originalVotes = await getAllVotes(proposal.id, Number(proposal.snapshot))
      const voters = originalVotes.map((vote) => {
        return vote.voter
      })

      const vps = await snapshot.utils.getScores(
        proposal.space.id,
        strategies,
        network.CHAIN_ID.toString(),
        voters,
        Number(proposal.snapshot)
      )
      const updatedVotes = originalVotes.map((vote) => {
        return { ...vote, vp: vps[0] && vps[0][vote.voter] }
      })
      if (mounted) {
        setVotes(updatedVotes)
      }
    }

    if (!!proposal && strategies) {
      getScore()
    }
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastRefresh, network])

  if (!proposal || !votes) {
    return <PageLoader />
  }

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="40px">
        <Button as={Link} to="/voting" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
          {t('Back to Proposals')}
        </Button>
      </Box>
      <Layout>
        <Box>
          <Box mb="32px">
            <Flex alignItems="center" mb="32px">
              <ProposalStateTag proposalState={proposal.state} />
              <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
            </Flex>
            <Heading as="h1" scale="xl" mb="16px">
              {proposal.title}
            </Heading>
            <Box>
              <ReactMarkdown>{proposal.body}</ReactMarkdown>
            </Box>
          </Box>
          {!isPageLoading && !hasAccountVoted && proposal.state === ProposalState.ACTIVE && (
            <Vote proposal={proposal} mb="16px" />
          )}
          <Votes votes={votes} />
        </Box>
        <Box>
          <Details proposal={proposal} />
          <Results choices={proposal.choices} votes={votes} />
        </Box>
      </Layout>
    </Container>
  )
}

export default Proposal
