import React, { useEffect, useState, useMemo } from 'react'
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
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import ReactMarkdown from 'components/ReactMarkdown'
import PageLoader from 'components/Loader/PageLoader'
import { FetchStatus } from 'config/constants/types'
import { useMemoFarms } from 'state/farms/hooks'
import tokens from 'config/constants/tokens'
import { getAddress, getMasterChefAddress, getHelixAutoPoolAddress, getHelixVaultAddress } from 'utils/addressHelpers'
import { isCoreProposal } from '../helpers'
import { ProposalStateTag, ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'
import Details from './Details'
import Results from './Results'
import Vote from './Vote'
import Votes from './Votes'
import { PageMeta } from '../../../components/Layout/Page'

const Proposal = () => {
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
  const { data: farmsLP } = useMemoFarms()
  const masterChefAddress = getMasterChefAddress()
  const autoHelixAddress = getHelixAutoPoolAddress()
  const vaultAddress = getHelixVaultAddress()
  const network = process.env.REACT_APP_CHAIN_ID
  const [votes, setVotes] = useState([])

  const helixLPs = farmsLP
    .filter((lp) => lp.pid !== 0)
    .filter((lp) => lp.lpSymbol.includes('HELIX'))
    .map((lp) => ({
      "address": getAddress(lp.lpAddresses),
      "pid": lp.pid
    }))

  useEffect(() => {
    dispatch(fetchProposal(id))
  }, [id, dispatch])

  // We have to wait for the proposal to load before fetching the votes because we need to include the snapshotId
  useEffect(() => {
    if (proposalId && snapshotId) {
      dispatch(fetchVotes({ proposalId, block: Number(snapshotId) }))
    }
  }, [proposalId, snapshotId, dispatch])

  useEffect(() => {
    let unmounted = false;
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
    const voters = votesGraphql.map((vote) => {
      return vote.voter
    })
    async function getScore() {
      const vps = await snapshot.utils.getScores(
        proposal.space.id,
        strategies,
        network,
        voters,
        Number(snapshotId)
      )
      const updatedVotes = votesGraphql.map((vote) => {
        return { ...vote, vp: vps[0] && vps[0][vote.voter] }
      })
      if (unmounted) return
      setVotes(updatedVotes)
    }
    if (!!proposal && !!votesGraphql && helixLPs) {
      getScore()
    }
    return () => {
      unmounted = true
    }
  }, [network, snapshotId, votesGraphql, proposal, vaultAddress, masterChefAddress, autoHelixAddress, helixLPs])

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
            <Flex alignItems="center" mb="8px">
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
