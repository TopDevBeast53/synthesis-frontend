import { useCallback, useMemo } from 'react';
import { getProviderOrSigner } from 'utils';
import { Contract } from '@ethersproject/contracts';

import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

import { getVotingAddress } from 'utils/addressHelpers';
import votingABI from 'config/abi/Voting.json';

export const useVoting = () => {
    const overrides = useMemo(() => ({
        gasLimit: 9999999
    }), []);

    const votingAddress = getVotingAddress();
    const { library, account } = useActiveWeb3React();
    const { callWithGasPrice } = useCallWithGasPrice();

    const getContract = useCallback(async () => { 
        return new Contract(votingAddress, votingABI, getProviderOrSigner(library, account));
    }, [library, account]);

    const getNumProposals = useCallback(async () => {
        const contract = getContract();
        return contract.numProposals();
    }, [getContract]);

    const getProposal = useCallback(async (proposalId) => {
        const contract = getContract();
        return contract.proposals(proposalId);
    }, [getContract]);

    const createProposal = useCallback(async (proposalName, endTimestamp) => {
        const contract = getContract();
        const tx = await callWithGasPrice(contract, 'createProposal', [proposalName, endTimestamp], overrides);
    });

    const vote = useCallback(async (proposalId, tokenAmount, decision) => {
        const contract = getContract();
        const tx = await callWithGasPrice(contract, 'vote', [proposalId, tokenAmount, decision], overrides);
    });

    const getProposalResults = useCallback(async (proposalId) => {
        const contract = getContract();
        return contract.resultProposal(proposalId);
    });

    const withdraw = useCallback(async (proposalId, amount) => {
        const contract = getContract();
        const tx = await callWithGasPrice(contract, 'withdraw', [proposalId, amount], overrides);
    });

    const getDecision = useCallback(async (proposalId, voter) => {
        const contract = getContract();
        return contract.getDecision(proposalId, voter);
    });

    const getVoters = useCallback(async (proposalId) => {
        const contract = getContract();
        return contract.voters(proposalId);
    });

    const getNumberOfVotes = useCallback(async (voter, proposalId) => {
        const contract = getContract();
        return contract.getNumberOfVotes(voter, proposalId);
    });

    const addCoreMember = useCallback(async (coreMember) => {
        const contract = getContract();
        const result = await callWithGasPrice(contract, 'addCoreMember', [coreMember], overrides);
        return result;
    });

    const delCoreMember = useCallback(async (coreMember) => {
        const contract = getContract();
        const result = await callWithGasPrice(contract, 'delCoreMember', [coreMember], overrides);
        return result;
    });

    const getCoreMembersLength = useCallback(async () => {
        const contract = getContract();
        return contract.getCoremembersLength();
    });

    const isCoreMember = useCallback(async (coreMember) => {
        const contract = getContract();
        return await contract.isCoreMember(coreMember);
    });

    const getCoreMember = useCallback(async (index) => {
        const contract = getContract();
        return await contract.getCoreMember(index);
    });

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
        getCoreMember
    };
};
