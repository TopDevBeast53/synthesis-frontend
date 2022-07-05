import React, { useMemo, useCallback } from 'react'
import moment from 'moment'
import Balance from 'components/Balance'
import { BigNumber } from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useTokenBalance from 'hooks/useTokenBalance'
import { usePriceHelixBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { AddIcon, Heading, IconButton, MinusIcon, Skeleton, Text, useModal } from 'uikit'
import { getBalanceNumber, getBalanceAmount } from 'utils/formatBalance'
import StakeModal from '../../VaultCard/Modals/StakeModal'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import NotEnoughTokensModal from '../../VaultCard/Modals/NotEnoughTokensModal'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps {
  isLoading
  deposit
  stakedBalance
  updateStake
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ isLoading, deposit, stakedBalance, updateStake }) => {
  const { t } = useTranslation()
  const { balance: helixBalance } = useTokenBalance(tokens.helix.address)

  const cakePrice = usePriceHelixBusd()
  const { decimals, symbol } = tokens.helix

  const tokenPrice = getBalanceNumber(cakePrice, decimals)
  const stakedTokenDollarBalance = getBalanceNumber(stakedBalance.multipliedBy(cakePrice), decimals)

  const canWithdraw = useMemo(() => {
    const withdrawDate = moment.unix(deposit?.withdrawTimeStamp)
    const today = moment()
    return withdrawDate.isSameOrBefore(today)
  }, [deposit])

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.00001)) {
      return '<0.00001'
    }
    if (stakedBalanceBigNumber.gt(0)) {
      return stakedBalanceBigNumber.toFixed(5, BigNumber.ROUND_DOWN)
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol="HELIX" />)

  const [onPresentStake] = useModal(
    <StakeModal
      totalBalance={helixBalance}
      stakedBalance={stakedBalance}
      tokenPrice={tokenPrice}
      stakingToken={tokens.helix}
      depositId={deposit.id}
      updateStake={updateStake}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      totalBalance={helixBalance}
      stakedBalance={stakedBalance}
      tokenPrice={tokenPrice}
      stakingToken={tokens.helix}
      depositId={deposit.id}
      isRemovingStake
      updateStake={updateStake}
    />,
  )

  if (isLoading) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {symbol}{' '}
        </Text>
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {t('Staked')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Heading>{displayBalance()}</Heading>
          {stakedBalance.gt(0) && (
            <Balance
              fontSize="12px"
              display="inline"
              color="textSubtle"
              decimals={2}
              value={stakedTokenDollarBalance}
              unit=" USD"
              prefix="~"
            />
          )}
        </div>
        <IconButtonWrapper>
          <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px" disabled={!canWithdraw}>
            <MinusIcon color={canWithdraw ? 'primary' : 'textDisabled'} width="14px" />
          </IconButton>
          <IconButton variant="secondary" onClick={helixBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>
        </IconButtonWrapper>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
