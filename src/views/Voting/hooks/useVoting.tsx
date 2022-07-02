import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'

import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { getVotingAddress } from 'utils/addressHelpers'
import votingABI from 'config/abi/Voting.json'

export const useVoting = () => {
  const votingAddress = getVotingAddress()
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getContract = useCallback(async () => {
    return new Contract(votingAddress, votingABI, getProviderOrSigner(library, account))
  }, [votingAddress, library, account])

  const getNumProposals = useCallback(async () => {
    const contract = await getContract()
    return contract.numProposals()
  }, [getContract])

  const getProposal = useCallback(
    async (proposalId) => {
      const contract = await getContract()
      return contract.proposals(proposalId)
    },
    [getContract],
  )

  const createProposal = useCallback(
    async (proposalName, endTimestamp) => {
      const contract = await getContract()
      return callWithGasPrice(contract, 'createProposal', [proposalName, endTimestamp])
    },
    [getContract, callWithGasPrice],
  )

  const vote = useCallback(
    async (proposalId, tokenAmount, decision) => {
      const contract = await getContract()
      return callWithGasPrice(contract, 'vote', [proposalId, tokenAmount, decision])
    },
    [getContract, callWithGasPrice],
  )

  const getProposalResults = useCallback(
    async (proposalId) => {
      const contract = await getContract()
      return contract.resultProposal(proposalId)
    },
    [getContract],
  )

  const withdraw = useCallback(
    async (proposalId, amount) => {
      const contract = await getContract()
      return callWithGasPrice(contract, 'withdraw', [proposalId, amount])
    },
    [getContract, callWithGasPrice],
  )

  const getDecision = useCallback(
    async (proposalId, voter) => {
      const contract = await getContract()
      return contract.getDecision(proposalId, voter)
    },
    [getContract],
  )

  const getVoters = useCallback(
    async (proposalId) => {
      const contract = await getContract()
      return contract.voters(proposalId)
    },
    [getContract],
  )

  const getNumberOfVotes = useCallback(
    async (voter, proposalId) => {
      const contract = await getContract()
      return contract.getNumberOfVotes(voter, proposalId)
    },
    [getContract],
  )

  const addCoreMember = useCallback(
    async (coreMember) => {
      const contract = await getContract()
      return callWithGasPrice(contract, 'addCoreMember', [coreMember])
    },
    [getContract, callWithGasPrice],
  )

  const delCoreMember = useCallback(
    async (coreMember) => {
      const contract = await getContract()
      return callWithGasPrice(contract, 'delCoreMember', [coreMember])
    },
    [getContract, callWithGasPrice],
  )

  const getCoreMembersLength = useCallback(async () => {
    const contract = await getContract()
    return contract.getCoremembersLength()
  }, [getContract])

  const isCoreMember = useCallback(
    async (coreMember) => {
      const contract = await getContract()
      return contract.isCoreMember(coreMember)
    },
    [getContract],
  )

  const getCoreMember = useCallback(
    async (index) => {
      const contract = await getContract()
      return contract.getCoreMember(index)
    },
    [getContract],
  )

  return {
    getNumProposals,
    getProposal,
    createProposal,
    vote,
    getProposalResults,
    withdraw,
    getDecision,
    getVoters,
    getNumberOfVotes,
    addCoreMember,
    delCoreMember,
    getCoreMembersLength,
    isCoreMember,
    getCoreMember,
  }
}
