import React, { useState, useEffect } from 'react'
import { Box, Modal } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { SnapshotCommand } from 'state/types'
import { signMessage } from 'utils/web3React'
import useToast from 'hooks/useToast'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import useTheme from 'hooks/useTheme'
import { CastVoteModalProps, ConfirmVoteView } from './types'
import MainView from './MainView'
import DetailsView from './DetailsView'
import { generatePayloadData, Message, sendSnapshotData } from '../../helpers'
import useGetVotingPower from '../../hooks/useGetVotingPower'
import { useEachVotingPower } from '../../hooks/useEachVotingPower'

const CastVoteModal: React.FC<CastVoteModalProps> = ({ onSuccess, proposalId, vote, onDismiss }) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [isPending, setIsPending] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { library, connector } = useWeb3Provider()
  const { theme } = useTheme()

  const { helixBalance, isLoading } = useGetVotingPower()
  const { getVaultHelix, getMasterchefHelix, getAutoPoolHelix, getLpHelix } = useEachVotingPower()
  const [totalHelix, setTotalHelix] = useState('')
  const [isLoadingHelix, setIsLoadingHelix] = useState(true)


  useEffect(() => {
    async function load() {
      const vaultHelix = await getVaultHelix()
      const masterchefHelix = await getMasterchefHelix()
      const autoPoolHelix = await getAutoPoolHelix()
      const lpHelix = await getLpHelix()
      const total = helixBalance.add(vaultHelix).add(masterchefHelix).add(autoPoolHelix).add(lpHelix).toString()
      setTotalHelix(total)
      setIsLoadingHelix(false)
    }
    load()
  }, [helixBalance, getVaultHelix, getMasterchefHelix, getAutoPoolHelix, getLpHelix])

  const total = Number(totalHelix) / 1e18


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
        ...generatePayloadData(),
        type: SnapshotCommand.VOTE,
        payload: {
          proposal: proposalId,
          choice: vote.value,
          metadata: {
            votingPower: total.toString(),
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
            isLoading={isLoadingHelix}
            isPending={isPending}
            total={total}
            onConfirm={handleConfirmVote}
            onViewDetails={handleViewDetails}
            onDismiss={handleDismiss}
          />
        )}
        {view === ConfirmVoteView.DETAILS && <DetailsView total={total} isLoading={isLoadingHelix} />}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
