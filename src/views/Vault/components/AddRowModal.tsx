import React, { useEffect, useMemo, useState } from 'react'
import {
  Modal, Text, Button, Flex, AutoRenewIcon, BalanceInput, Slider, Image, CalculateIcon,
  IconButton, Skeleton
} from 'uikit'
import styled from 'styled-components'
import Select from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import { useHelixVault } from 'hooks/useContract'
import getTokens from 'config/constants/tokens'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { logError } from 'utils/sentry'
import { DurationStructOutput } from 'config/abi/types/HelixVault'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { getVaultApr } from 'utils/apr'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import PercentageButton from './VaultCard/Modals/PercentageButton'
import { useHelixLockVault } from '../hooks/useHelixLockVault'

interface ModalProps {
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  tokenPerBlock: number
  totalStakedVault: number
  onAdd?: () => void
  onDismiss?: () => void
}

type Duration = DurationStructOutput & {
  apr: number
}

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`

const AddRowModal: React.FC<ModalProps> = ({ stakingTokenBalance, stakingTokenPrice, totalStakedVault, tokenPerBlock, onAdd, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const tokenDecimals = getTokens.helix.decimals
  const tokenSymbol = getTokens.helix.symbol
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit] = useState(false)
  const [percent, setPercent] = useState(0)
  const usdValueStaked = new BigNumber(stakeAmount).times(stakingTokenPrice)
  const formattedUsdValueStaked = !usdValueStaked.isNaN() && formatNumber(usdValueStaked.toNumber())
  const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), tokenDecimals)
  const userNotEnoughToken = stakingTokenBalance.lt(fullDecimalStakeAmount)
  const { toastSuccess, toastError } = useToast()
  const [durationOptions, setDurationOptions] = useState([])
  const [durationIndex, setDurationIndex] = useState(0)
  const [durations, setDurations] = useState<Duration[]>([]);
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)

  const getTokenLink = `/swap?outputCurrency=${getTokens.helix.address}`

  const currentAPR = useMemo(() => {
    if (durations.length === 0) return 0;
    return durations[durationIndex].apr;
  }, [durations, durationIndex]);

  const { annualRoi, formattedAnnualRoi } = useMemo(() => {
    const interestBreakdown = getInterestBreakdown({
      principalInUSD: !usdValueStaked.isNaN() ? usdValueStaked.toNumber() : 0,
      apr: currentAPR,
      earningTokenPrice: stakingTokenPrice,
    })
    const annualRoi_ = interestBreakdown[3] * stakingTokenPrice
    const formattedAnnualRoi_ = formatNumber(annualRoi_, annualRoi_ > 10000 ? 0 : 2, annualRoi_ > 10000 ? 0 : 2)
    return {
      annualRoi: annualRoi_,
      formattedAnnualRoi: formattedAnnualRoi_
    }
  }, [stakingTokenPrice, usdValueStaked, currentAPR]);

  const { getDurations, addNewDeposit } = useHelixLockVault()
  const helixVaultContract = useHelixVault()
  useEffect(() => {
    load()
    async function load() {
      try {
        const res: DurationStructOutput[] = await helixVaultContract.getDurations()
        const options = res.map((item: DurationStructOutput, index) => {
          const days = item.duration.toNumber() / 3600 / 24
          return {
            label: `${days} days`,
            value: index,
          }
        }, [])
        setDurationOptions(options)

        const durations_ = res.map((item: DurationStructOutput) => ({
          ...item,
          apr: getVaultApr(totalStakedVault, tokenPerBlock, Number(item.weight.toString()))
        }))
        setDurations(durations_);
      } catch (err) {
        logError(err)
      }
    }
  }, [getDurations, helixVaultContract, totalStakedVault, tokenPerBlock])

  const handleDeposit = async () => {
    setPendingTx(true)
    const amount = new BigNumber(stakeAmount)
    try {
      await addNewDeposit(getDecimalAmount(amount, tokenDecimals).toString(), durationIndex)
      if (onAdd) onAdd()
      toastSuccess(`${t('Success')}!`, t(`You added ${Number.parseFloat(stakeAmount).toFixed(3)} HELIX to the vault!`))
    } catch (err) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
    setPendingTx(false)
    onDismiss()
  }

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), tokenDecimals)
      const percentage = Math.floor(convertedInput.dividedBy(stakingTokenBalance).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = stakingTokenBalance.dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, tokenDecimals, tokenDecimals)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }
  const handleOptionChange = (option) => {
    setDurationIndex(option.value)
  }

  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        earningTokenPrice={stakingTokenPrice}
        stakingTokenPrice={stakingTokenPrice}
        apr={currentAPR}
        linkLabel={t('Get %symbol%', { symbol: "HELIX" })}
        linkHref={getTokenLink}
        stakingTokenBalance={stakingTokenBalance}
        stakingTokenSymbol="HELIX"
        earningTokenSymbol="HELIX"
        onBack={() => setShowRoiCalculator(false)}
        initialValue={stakeAmount}
      />
    )
  }

  return (
    <Modal title={t('Create Vault')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Text>
        {' '}
        {t('Period')} / {t('days')}{' '}
      </Text>
      {durationOptions.length !== 0 && <Select options={durationOptions}
        defaultOptionIndex={durationIndex}
        onOptionChange={handleOptionChange} />}

      <Flex alignItems="center" justifyContent="space-between" mb="8px" mt={4}>
        <Text bold>{t('Amount')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${getTokens.helix.address}.png`} width={24} height={24} alt="HELIX" />
          <Text ml="4px" bold>
            {t('Helix')}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={stakingTokenPrice !== 0 && `~${formattedUsdValueStaked || 0} USD`}
        isWarning={hasReachedStakeLimit || userNotEnoughToken}
        decimals={tokenDecimals}
      />
      {hasReachedStakeLimit && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Maximum total stake: %amount% %token%', {
            amount: getFullDisplayBalance(new BigNumber(stakingTokenBalance), tokenDecimals, 0),
            token: tokenSymbol,
          })}
        </Text>
      )}
      {userNotEnoughToken && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Insufficient %symbol% balance', {
            symbol: tokenSymbol,
          })}
        </Text>
      )}
      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t('Balance: %balance%', {
          balance: getFullDisplayBalance(stakingTokenBalance, tokenDecimals),
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

      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        <Text mr="8px" color="textSubtle">
          {t('Annual ROI at current rates')}:
        </Text>
        {Number.isFinite(annualRoi) ? (
          <AnnualRoiContainer
            alignItems="center"
            onClick={() => {
              setShowRoiCalculator(true)
            }}
          >
            <AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay>
            <IconButton variant="text" scale="sm">
              <CalculateIcon color="textSubtle" width="18px" />
            </IconButton>
          </AnnualRoiContainer>
        ) : (
          <Skeleton width={60} />
        )}
      </Flex>

      <Button
        isLoading={pendingTx}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit || userNotEnoughToken}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleDeposit}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        {t('Close Window')}
      </Button>
    </Modal>
  )
}

export default AddRowModal
