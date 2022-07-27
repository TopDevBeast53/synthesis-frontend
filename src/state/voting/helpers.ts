import request, { gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import { Proposal, ProposalState, Vote, VoteWhere } from 'state/types'
import { ChainId } from 'sdk'

export const getProposals = async (first = 5, skip = 0, state = ProposalState.ACTIVE): Promise<Proposal[]> => {
    const chainId = process.env.REACT_APP_CHAIN_ID
    const space = Number(chainId) === ChainId.MAINNET ? "helixgeometry.eth" : "silverstardev.eth"

    const response: { proposals: Proposal[] } = await request(
        SNAPSHOT_API,
        gql`
            query getProposals($first: Int!, $skip: Int!, $state: String!, $space: String!) {
                proposals(
                    first: $first
                    skip: $skip
                    orderBy: "end"
                    orderDirection: desc
                    where: { space_in: [$space], state: $state }
                ) {
                    id
                    title
                    body
                    choices
                    start
                    end
                    snapshot
                    state
                    author
                    space {
                        id
                        name
                    }
                }
            }
        `,
        { first, skip, state, space },
    )
    return response.proposals
}

export const getProposal = async (id: string): Promise<Proposal> => {
    const response: { proposal: Proposal } = await request(
        SNAPSHOT_API,
        gql`
            query getProposal($id: String) {
                proposal(id: $id) {
                    id
                    title
                    body
                    choices
                    start
                    end
                    snapshot
                    state
                    author
                    space {
                        id
                        name
                    }
                }
            }
        `,
        { id },
    )
    return response.proposal
}

export const getVotes = async (first: number, skip: number, where: VoteWhere): Promise<Vote[]> => {
    const response: { votes: Vote[] } = await request(
        SNAPSHOT_API,
        gql`
            query getVotes($first: Int, $skip: Int, $where: VoteWhere) {
                votes(first: $first, skip: $skip, where: $where) {
                    id
                    voter
                    created
                    choice
                    space {
                        id
                        name
                    }
                    proposal {
                        choices
                    }
                    metadata
                    vp
                }
            }
        `,
        { first, skip, where },
    )
    return response.votes
}

export const getAllVotes = async (proposalId: string, block?: number, votesPerChunk = 1000): Promise<Vote[]> => {
    return new Promise((resolve, reject) => {
        let votes: Vote[] = []

        const fetchVoteChunk = async (newSkip: number) => {
            try {
                const voteChunk = await getVotes(votesPerChunk, newSkip, { proposal: proposalId })

                if (voteChunk.length === 0) {
                    resolve(votes)
                } else {
                    votes = [...votes, ...voteChunk]
                    fetchVoteChunk(newSkip + votesPerChunk)
                }
            } catch (error) {
                reject(error)
            }
        }

        fetchVoteChunk(0)
    })
}
