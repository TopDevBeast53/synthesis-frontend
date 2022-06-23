import React, { useEffect, useState } from 'react'
import { Box, InjectedModalProps, Modal, Button } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useGetVotingPower from '../hooks/useGetVotingPower'
import DetailsView from './CastVoteModal/DetailsView'
import { useEachVotingPower } from '../hooks/useEachVotingPower'

const VoteDetailsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { helixBalance } = useGetVotingPower()
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

  const { theme } = useTheme()

  const handleDismiss = () => {
    onDismiss()
  }

  return (
    <Modal title={t('Voting Power')} onDismiss={handleDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Box mb="24px" width="320px">
        <>
          <DetailsView total={total} isLoading={isLoadingHelix} />
          <Button variant="secondary" onClick={onDismiss} width="100%" mt="16px">
            {t('Close')}
          </Button>
        </>
      </Box>
    </Modal>
  )
}

export default VoteDetailsModal
