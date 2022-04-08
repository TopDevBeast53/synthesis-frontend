import React from 'react'
import { Box, Flex, InjectedModalProps, Modal, Button, Spinner } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useGetVotingPower from '../hooks/useGetVotingPower'
import DetailsView from './CastVoteModal/DetailsView'

const VoteDetailsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  const { helixBalance , isLoading } = useGetVotingPower()
  const total = Number(helixBalance.toString()) / 1e18

  const { theme } = useTheme()

  const handleDismiss = () => {
    onDismiss()
  }

  return (
    <Modal title={t('Voting Power')} onDismiss={handleDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Box mb="24px" width="320px">
        {isLoading ? (
          <Flex height="450px" alignItems="center" justifyContent="center">
            <Spinner size={80} />
          </Flex>
        ) : (
          <>
            <DetailsView total={total} />
            <Button variant="secondary" onClick={onDismiss} width="100%" mt="16px">
              {t('Close')}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default VoteDetailsModal
