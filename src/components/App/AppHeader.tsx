import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, HeadingLeftAligned, IconButton, ArrowBackIcon, NotificationDot } from 'uikit'
import { Link } from 'react-router-dom'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { CHAIN_IDS_TO_NAMES } from 'config/constants/networks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
  pool?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false, pool = false }) => {
  const [expertMode] = useExpertModeManager()
  const { chainId } = useActiveWeb3React()

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <IconButton as={Link} to={{ pathname: backTo, search: `chain=${CHAIN_IDS_TO_NAMES[chainId]}` }}>
            <ArrowBackIcon width="32px" />
          </IconButton>
        )}
        <Flex flexDirection="column">
          {
            pool ?
              (<HeadingLeftAligned as="h2" mb="8px">
                {title}
              </HeadingLeftAligned>)
              : (<Heading as="h2" mb="8px">
                {title}
              </Heading>)
          }
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {subtitle}
            </Text>
            {helper && <QuestionHelper text={helper} ml="4px" placement="top-start" />}
          </Flex>
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <GlobalSettings />
          </NotificationDot>
          <Transactions />
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
