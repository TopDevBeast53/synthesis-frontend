import { SNAPSHOT_VOTING_API } from 'config/constants/endpoints'
import useProviders from 'hooks/useProviders'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Vote } from 'state/types'
import { State } from '../types'

// Voting
export const useGetProposals = () => {
    const proposals = useSelector((state: State) => state.voting.proposals)
    return Object.values(proposals)
}

export const useGetProposal = (proposalId: string) => {
    const proposal = useSelector((state: State) => state.voting.proposals[proposalId])
    return proposal
}

export const useGetVotes = (proposalId: string) => {
    const votes = useSelector((state: State) => state.voting.votes[proposalId])
    return votes ? votes.filter((vote) => vote._inValid !== true) : []
}

export const useGetVotingStateLoadingStatus = () => {
    const votingStatus = useSelector((state: State) => state.voting.voteLoadingStatus)
    return votingStatus
}

export const useGetProposalLoadingStatus = () => {
    const votingStatus = useSelector((state: State) => state.voting.proposalLoadingStatus)
    return votingStatus
}

export const useGetVoteVerificationStatuses = () => {
    const rpcProvider = useProviders()
    return useCallback(async (
        votes: Vote[],
        block?: number,
    ): Promise<{ [key: string]: boolean }> => {
        const blockNumber = block || (await rpcProvider.getBlockNumber())

        const votesToVerify = votes.map((vote) => ({
            address: vote.voter,
            verificationHash: vote.metadata?.verificationHash,
            total: vote.metadata?.votingPower,
        }))
        const response = await fetch(`${SNAPSHOT_VOTING_API}/verify`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                block: blockNumber,
                votes: votesToVerify,
            }),
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        const data = await response.json()
        return votes.reduce((accum, vote) => {
            return {
                ...accum,
                [vote.id]: data.data[vote.voter.toLowerCase()]?.isValid === true,
            }
        }, {})
    }, [rpcProvider])
}