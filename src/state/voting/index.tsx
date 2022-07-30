import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchStatus } from 'config/constants/types'
import { merge } from 'lodash'
import { Proposal, ProposalState, VotingState, Vote, VotingPower } from 'state/types'
import { getAllVotes, getVP, getProposal, getProposals } from './helpers'

const initialState: VotingState = {
  proposalLoadingStatus: FetchStatus.Idle,
  proposals: {},
  voteLoadingStatus: FetchStatus.Idle,
  votes: {},
  vpLoadingStatus: FetchStatus.Idle,
  vp: {
    vp: 0,
    vp_by_strategy: [],
    vp_state: ''
  },
}

// Thunks
export const fetchProposals = createAsyncThunk<Proposal[], { first?: number; skip?: number; state?: ProposalState }>(
  'voting/fetchProposals',
  async ({ first, skip = 0, state = ProposalState.ACTIVE }) => {
    const response = await getProposals(first, skip, state)
    return response
  },
)

export const fetchProposal = createAsyncThunk<Proposal, string>('voting/fetchProposal', async (proposalId) => {
  const response = await getProposal(proposalId)
  return response
})

export const fetchVotes = createAsyncThunk<
  { votes: Vote[]; proposalId: string },
  { proposalId: string; block?: number }
>('voting/fetchVotes', async ({ proposalId, block }) => {
  const response = await getAllVotes(proposalId, block)
  return { votes: response, proposalId }
})

export const fetchVotingPower = createAsyncThunk<
  VotingPower,
  { voter: string; space: string; proposal: string }
>('voting/fetchVotingPower', async ({ voter, space, proposal }) => {
  const response = await getVP(voter, space, proposal)
  return response
})

export const votingSlice = createSlice({
  name: 'voting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // Fetch Proposals
    builder.addCase(fetchProposals.pending, (state) => {
      state.proposalLoadingStatus = FetchStatus.Fetching
    })
    builder.addCase(fetchProposals.fulfilled, (state, action) => {
      const proposals = action.payload.reduce((accum, proposal) => {
        return {
          ...accum,
          [proposal.id]: proposal,
        }
      }, {})

      state.proposals = merge({}, state.proposals, proposals)
      state.proposalLoadingStatus = FetchStatus.Fetched
    })

    // Fetch Proposal
    builder.addCase(fetchProposal.pending, (state) => {
      state.proposalLoadingStatus = FetchStatus.Fetching
    })
    builder.addCase(fetchProposal.fulfilled, (state, action) => {
      state.proposals[action.payload.id] = action.payload
      state.proposalLoadingStatus = FetchStatus.Fetched
    })

    // Fetch Votes
    builder.addCase(fetchVotes.pending, (state) => {
      state.voteLoadingStatus = FetchStatus.Fetching
    })
    builder.addCase(fetchVotes.fulfilled, (state, action) => {
      const { votes, proposalId } = action.payload

      state.votes = {
        ...state.votes,
        [proposalId]: votes,
      }
      state.voteLoadingStatus = FetchStatus.Fetched
    })

    // Fetch Voting Power
    builder.addCase(fetchVotingPower.pending, (state) => {
      state.vpLoadingStatus = FetchStatus.Fetching
    })
    builder.addCase(fetchVotingPower.fulfilled, (state, action) => {
      state.vp = action.payload
      state.vpLoadingStatus = FetchStatus.Fetched
    })
  },
})

export default votingSlice.reducer
