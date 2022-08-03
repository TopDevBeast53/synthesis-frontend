import React, { useState, useEffect } from 'react'
import { Box, Modal } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { SnapshotCommand } from 'state/types'
import { signMessage } from 'utils/web3React'
import { useAppDispatch } from 'state'
import useToast from 'hooks/useToast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTheme from 'hooks/useTheme'
import { fetchVotingPower } from 'state/voting'
import { FetchStatus } from 'config/constants/types'
import { useGetVotingPower, useGetVotingPowerStateLoadingStatus } from 'state/voting/hooks'
import { CastVoteModalProps, ConfirmVoteView } from './types'
import MainView from './MainView'
import DetailsView from './DetailsView'
import { generatePayloadData, Message, sendSnapshotData } from '../../helpers'

const CastVoteModal: React.FC<CastVoteModalProps> = ({ onSuccess, proposalId, spaceId, vote, onDismiss }) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [isPending, setIsPending] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { library, connector } = useActiveWeb3React()
  const { theme } = useTheme()

  const votingPower = useGetVotingPower()
  const votingPowerLoadingStatus = useGetVotingPowerStateLoadingStatus()
  const isVotingPowerLoading = votingPowerLoadingStatus === FetchStatus.Fetching

  useEffect(() => {
    if (account && spaceId && proposalId) {
      dispatch(fetchVotingPower({ voter: account, space: spaceId, proposal: proposalId }))
    }
  }, [proposalId, account, spaceId, dispatch])

  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)
  const handleViewDetails = () => setView(ConfirmVoteView.DETAILS)

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  const handleDismiss = () => {
    onDismiss()
  }

  const handleConfirmVote = async () => {
    try {
      setIsPending(true)
      const voteMsg = JSON.stringify({
        ...generatePayloadData(chainId),
        type: SnapshotCommand.VOTE,
        payload: {
          proposal: proposalId,
          choice: vote.value,
          metadata: {
            votingPower: votingPower.vp,
          },
        },
      })

      const sig = await signMessage(connector, library, account, voteMsg)
      const msg: Message = { address: account, msg: voteMsg, sig }

      // Save proposal to snapshot
      await sendSnapshotData(msg)
      setIsPending(false)

      await onSuccess()

      handleDismiss()
    } catch (error) {
      setIsPending(false)
      toastError(t('Error'), (error as Error)?.message)
      console.error(error)
    }
  }

  return (
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Box mb="24px" width="320px">
        {view === ConfirmVoteView.MAIN && (
          <MainView
            vote={vote}
            isLoading={isVotingPowerLoading}
            isPending={isPending}
            total={votingPower.vp}
            onConfirm={handleConfirmVote}
            onViewDetails={handleViewDetails}
            onDismiss={handleDismiss}
          />
        )}
        {view === ConfirmVoteView.DETAILS && <DetailsView total={votingPower.vp} isLoading={isVotingPowerLoading} />}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
