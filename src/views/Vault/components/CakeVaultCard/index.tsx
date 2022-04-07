import React from 'react'
import styled from 'styled-components'
import {
  Box,
  CardBody,
  Flex,
  Text,
  CardProps,
  HelpIcon,
  useTooltip,
  LinkExternal,
  Link,
  TokenPairImage,
} from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useIfoPoolCreditBlock, useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey } from 'state/types'
import { convertSharesToAura } from 'views/Pools/helpers'
import { FlexGap } from 'components/Layout/Flex'
import { vaultPoolConfig } from 'config/constants/pools'
import { getBscScanLink } from 'utils'
import AprRow from '../VaultCard/AprRow'
import { StyledCard } from '../VaultCard/StyledCard'
import CardFooter from '../VaultCard/CardFooter'
import PoolCardHeader, { VaultCardHeaderTitle } from '../VaultCard/PoolCardHeader'
import VaultCardActions from './VaultCardActions'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentAuraProfitRow from './RecentAuraProfitRow'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface AuraVaultProps extends CardProps {
  pool: DeserializedPool
  showStakedOnly: boolean
  defaultFooterExpanded?: boolean
}

export const CreditCalcBlock = () => {
  const { creditStartBlock, creditEndBlock, hasEndBlockOver } = useIfoPoolCreditBlock()
  const { t } = useTranslation()

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    hasEndBlockOver ? (
      <>
        <Text>
          {t(
            'The latest credit calculation period has ended. After the coming IFO, credits will be reset and the calculation will resume.',
          )}
        </Text>
        <LinkExternal href="https://twitter.com/panauraswap">
          {t('Follow us on Twitter to catch the latest news about the coming IFO.')}
        </LinkExternal>
      </>
    ) : (
      <>
        <Text>
          {t(
            'The start block of the current calculation period. Your average IFO AURAPool staking balance is calculated throughout this period.',
          )}
        </Text>
        <LinkExternal href="https://medium.com/panauraswap/initial-farm-offering-ifo-3-0-ifo-staking-pool-622d8bd356f1">
          {t('Check out our Medium article for more details.')}
        </LinkExternal>
      </>
    ),
    { placement: 'auto' },
  )

  return (
    <Flex mt="8px" justifyContent="space-between">
      <Text fontSize="14px">{hasEndBlockOver ? t('Credit calculation ended:') : t('Credit calculation starts:')}</Text>
      <Flex mr="6px" alignItems="center">
        <Link
          external
          href={getBscScanLink(hasEndBlockOver ? creditEndBlock : creditStartBlock, 'block')}
          mr="4px"
          color={hasEndBlockOver ? 'warning' : 'primary'}
          fontSize="14px"
        >
          {hasEndBlockOver ? creditEndBlock : creditStartBlock}
        </Link>
        <span ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </span>
      </Flex>
      {tooltipVisible && tooltip}
    </Flex>
  )
}

const AuraVaultCard: React.FC<AuraVaultProps> = ({ pool, showStakedOnly, defaultFooterExpanded, ...props }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)

  const { auraAsBigNumber } = convertSharesToAura(userShares, pricePerFullShare)

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard isActive {...props}>
      <PoolCardHeader isStaking={accountHasSharesStaked}>
        <VaultCardHeaderTitle
          title={t(vaultPoolConfig[pool.vaultKey].name)}
          subTitle={t(vaultPoolConfig[pool.vaultKey].description)}
        />
        <TokenPairImage {...vaultPoolConfig[pool.vaultKey].tokenImage} width={64} height={64} />
      </PoolCardHeader>
      <StyledCardBody isLoading={isLoading}>
        <AprRow pool={pool} stakedBalance={auraAsBigNumber} performanceFee={performanceFeeAsDecimal} />
        {pool.vaultKey === VaultKey.IfoPool && <CreditCalcBlock />}
        <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
          <Box>
            <Box mt="24px">
              <RecentAuraProfitRow vaultKey={pool.vaultKey} />
            </Box>
            <Box mt="8px">
              <UnstakingFeeCountdownRow vaultKey={pool.vaultKey} />
            </Box>
          </Box>
          <Flex flexDirection="column">
            {account ? (
              <VaultCardActions
                pool={pool}
                accountHasSharesStaked={accountHasSharesStaked}
                isLoading={isLoading}
                performanceFee={performanceFeeAsDecimal}
              />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Start earning')}
                </Text>
                <ConnectWalletButton />
              </>
            )}
          </Flex>
        </FlexGap>
      </StyledCardBody>
      <CardFooter defaultExpanded={defaultFooterExpanded} pool={pool} account={account} />
    </StyledCard>
  )
}

export default AuraVaultCard
