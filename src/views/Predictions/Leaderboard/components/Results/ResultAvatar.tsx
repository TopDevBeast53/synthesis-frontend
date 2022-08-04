import React from 'react'
import { Box, Flex, FlexProps, Link, ProfileAvatar, SubMenu, SubMenuItem, useModal, Text } from 'uikit'
import styled from 'styled-components'
import { getEtherScanLink } from 'utils'
import { PredictionUser } from 'state/types'
import { useGetProfileAvatar } from 'state/profile/hooks'
import truncateHash from 'utils/truncateHash'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CHAIN_IDS_TO_NAMES } from 'config/constants/networks'
import WalletStatsModal from '../WalletStatsModal'

interface ResultAvatarProps extends FlexProps {
  user: PredictionUser
}

const AvatarWrapper = styled(Box)`
  order: 2;
  margin-left: 8px;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 1;
    margin-left: 0;
    margin-right: 8px;
  }
`

const UsernameWrapper = styled(Box)`
  order: 1;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 2;
  }
`

const ResultAvatar: React.FC<ResultAvatarProps> = ({ user, ...props }) => {
  const { t } = useTranslation()
  const profileAvatar = useGetProfileAvatar(user.id)
  const [onPresentWalletStatsModal] = useModal(<WalletStatsModal account={user.id} />)
  const { chainId } = useActiveWeb3React()

  return (
    <SubMenu
      component={
        <Flex alignItems="center" {...props}>
          <UsernameWrapper>
            <Text color="primary" fontWeight="bold">
              {profileAvatar.username || truncateHash(user.id)}
            </Text>{' '}
          </UsernameWrapper>
          <AvatarWrapper
            width={['32px', null, null, null, null, '40px']}
            height={['32px', null, null, null, null, '40px']}
          >
            <ProfileAvatar src={profileAvatar.nft?.image?.thumbnail} height={40} width={40} />
          </AvatarWrapper>
        </Flex>
      }
      options={{ placement: 'bottom-start' }}
    >
      <SubMenuItem onClick={onPresentWalletStatsModal}>{t('View Stats')}</SubMenuItem>
      <SubMenuItem as={Link} href={`${getEtherScanLink(user.id, 'address', chainId)}?chain=${CHAIN_IDS_TO_NAMES[chainId]}`} bold={false} color="text" external>
        {t('View on EtherScan')}
      </SubMenuItem>
    </SubMenu>
  )
}

export default ResultAvatar
