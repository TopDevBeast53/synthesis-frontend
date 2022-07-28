import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import React, { useState } from 'react'
import { useGetTokens } from 'hooks/useGetTokens'
import { Token } from 'sdk'
import styled from 'styled-components'
import { AutoRenewIcon, BalanceInput, Button, Flex, Image, Link, Modal, Slider, Text } from 'uikit'
import { formatNumber, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { usePriceHelixBusd } from 'state/farms/hooks'
import { logError } from 'utils/sentry'
import { useHelixLockVault } from 'views/Vault/hooks/useHelixLockVault'
import PercentageButton from './PercentageButton'

interface StakeModalProps {
  totalBalance: BigNumber
  stakedBalance: BigNumber
  tokenPrice: number
  stakingToken: Token
  depositId
  isRemovingStake?: boolean
  updateStake
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const StakeModal: React.FC<StakeModalProps> = ({
  totalBalance,
  tokenPrice,
  stakedBalance,
  stakingToken,
  depositId,
  isRemovingStake = false,
  updateStake,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const tokens = useGetTokens()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  // const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const hasReachedStakeLimit = false
  const [percent, setPercent] = useState(0)
  const { decimals, symbol, address } = tokens.helix
  const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), decimals)
  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) return stakedBalance
    return totalBalance
  }
  const userNotEnoughToken = isRemovingStake
    ? stakedBalance.lt(fullDecimalStakeAmount)
    : totalBalance.lt(fullDecimalStakeAmount)
    const helixPriceBusd = usePriceHelixBusd()
    const usdValueStaked = new BigNumber(stakeAmount).times(helixPriceBusd)
  // const usdValueStaked = new BigNumber(stakeAmount).times(tokenPrice)
  const formattedUsdValueStaked = !usdValueStaked.isNaN() && formatNumber(usdValueStaked.toNumber())
  const getTokenLink = stakingToken.address ? `/swap?outputCurrency=${stakingToken.address}` : '/swap'

  // useEffect(() => {
  //   if (!isRemovingStake) {
  //     setHasReachedStakedLimit(fullDecimalStakeAmount.plus(stakedBalance).gt(totalBalance))
  //   }
  // }, [totalBalance, stakedBalance, isRemovingStake, setHasReachedStakedLimit, fullDecimalStakeAmount])

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), decimals)
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = getCalculatedStakingLimit().dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, decimals, decimals)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }
  const { deposit, withdraw } = useHelixLockVault()
  const handleConfirmClick = async () => {
    setPendingTx(true)
    try {
      if (isRemovingStake) {
        // unstaking
        // await onUnstake(stakeAmount, decimals)
        const stakeAmountNumber = getDecimalAmount(new BigNumber(stakeAmount))
        await withdraw(stakeAmountNumber.toString(), depositId)
        let newBalance: BigNumber = stakedBalance
        newBalance = newBalance.minus(stakeAmountNumber)
        updateStake(newBalance)
        toastSuccess(
          `${t('Unstaked')}!`,
          t('Your %symbol% earnings have also been harvested to your wallet!', {
            symbol,
          }),
        )
      } else {
        // staking
        const stakeAmountNumber = getDecimalAmount(new BigNumber(stakeAmount))
        await deposit(stakeAmountNumber.toString(), depositId)

        let newBalance: BigNumber = stakedBalance
        newBalance = newBalance.plus(stakeAmountNumber)
        updateStake(newBalance)
        toastSuccess(
          `${t('Staked')}!`,
          t('Your %symbol% funds have been staked in the pool!', {
            symbol,
          }),
        )
      }
      setPendingTx(false)
      onDismiss()
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }

  return (
    <Modal
      minWidth="346px"
      title={isRemovingStake ? t('Withdraw') : t('Update Vault Amount')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? t('Amount') : t('Amount')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${address}.png`} width={24} height={24} alt={symbol} />
          <Text ml="4px" bold>
            {symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={tokenPrice !== 0 && `~${formattedUsdValueStaked || 0} USD`}
        isWarning={hasReachedStakeLimit || userNotEnoughToken}
        decimals={decimals}
      />
      {hasReachedStakeLimit && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Maximum total stake: %amount% %token%', {
            amount: getFullDisplayBalance(new BigNumber(totalBalance), decimals, 0),
            token: symbol,
          })}
        </Text>
      )}
      {userNotEnoughToken && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Insufficient %symbol% balance', {
            symbol,
          })}
        </Text>
      )}
      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t('Balance: %balance%', {
          balance: getFullDisplayBalance(getCalculatedStakingLimit(), decimals),
        })}
      </Text>
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
      </Flex>
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit || userNotEnoughToken}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      {!isRemovingStake && (
        <StyledLink external href={getTokenLink}>
          <Button width="100%" mt="8px" variant="secondary">
            {t('Get %symbol%', { symbol })}
          </Button>
        </StyledLink>
      )}
    </Modal>
  )
}

export default StakeModal
