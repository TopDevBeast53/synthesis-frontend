import React, { useState, useEffect } from 'react'
import { Box, Modal } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { SnapshotCommand } from 'state/types'
import { signMessage } from 'utils/web3React'
import useToast from 'hooks/useToast'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import useTheme from 'hooks/useTheme'
import snapshot from '@snapshot-labs/snapshot.js'
import { useFarms } from 'state/farms/hooks'
import { useGetTokens } from 'hooks/useGetTokens'
import { useFastFresh } from 'hooks/useRefresh'
import { getAddress, getMasterChefAddress, getHelixAutoPoolAddress, getHelixVaultAddress } from 'utils/addressHelpers'
import { CastVoteModalProps, ConfirmVoteView } from './types'
import MainView from './MainView'
import DetailsView from './DetailsView'
import { generatePayloadData, Message, sendSnapshotData } from '../../helpers'

const CastVoteModal: React.FC<CastVoteModalProps> = ({ onSuccess, proposalId, spaceId, vote, block, onDismiss }) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [isPending, setIsPending] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const tokens = useGetTokens()
  const { toastError } = useToast()
  const { library, connector, chainId } = useWeb3Provider()
  const { theme } = useTheme()

  const [totalVp, setTotalVp] = useState('')
  const [isLoadingHelix, setIsLoadingHelix] = useState(true)

  const fastRefresh = useFastFresh()
  const { data: farmsLP } = useFarms()
  const masterChefAddress = getMasterChefAddress(chainId)
  const autoHelixAddress = getHelixAutoPoolAddress(chainId)
  const vaultAddress = getHelixVaultAddress(chainId)

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
      const vp = await snapshot.utils.getScores(
        spaceId,
        strategies,
        chainId.toString(),
        [account],
        block
      )
      setIsLoadingHelix(false)
      if (mounted) {
        setTotalVp(vp[0][account] ? vp[0][account] : '')
      }
    }

    if (account && strategies) {
      getScore()
    }
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastRefresh, account, chainId])

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
            votingPower: totalVp,
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
            total={Number(totalVp)}
            onConfirm={handleConfirmVote}
            onViewDetails={handleViewDetails}
            onDismiss={handleDismiss}
          />
        )}
        {view === ConfirmVoteView.DETAILS && <DetailsView total={Number(totalVp)} isLoading={isLoadingHelix} />}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
