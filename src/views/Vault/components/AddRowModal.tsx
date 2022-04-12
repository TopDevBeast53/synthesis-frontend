import React, { useEffect, useState } from 'react'
import {
  Modal,
  Text,
  Button,  
  Flex,  
  AutoRenewIcon,
  BalanceInput,
  Slider,
} from 'uikit'
import Select from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import { useHelixVault } from 'hooks/useContract'
import tokens from 'config/constants/tokens'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { logError } from 'utils/sentry'
import { DurationStructOutput } from 'config/abi/types/HelixVault'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import PercentageButton from './VaultCard/Modals/PercentageButton'
import { useHelixLockVault } from '../hooks/useHelixLockVault'

interface ModalProps {  
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  onAdd?: () => void
  onDismiss?: () => void  
}

const AddRowModal: React.FC<ModalProps> = ({
  stakingTokenBalance,
  stakingTokenPrice,  
  onAdd,
  onDismiss
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const tokenDecimals = tokens.helix.decimals
  const tokenSymbol = tokens.helix.symbol
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
  const [durationIndex, setDurationIndex]=useState(0)

  const {getDurations, addNewDeposit} = useHelixLockVault()
  const helixVaultContract = useHelixVault()
  useEffect(()=>{
    load()
    async function load(){
      try{
        const res:DurationStructOutput[] = await helixVaultContract.getDurations()        
        const options = res.map((item:DurationStructOutput, index)=>{
          const days= item.duration.toNumber() / 3600 / 24
          return {
            label: `${days} days`,
            value: index
          }
        }, [])        
        setDurationOptions(options)
      }catch(err){
        logError(err)
      }
    }
  }, [getDurations, helixVaultContract])
  const handleDeposit = async ()=>{
    setPendingTx(true)
    const amount= new BigNumber(stakeAmount)
    try{      
      await addNewDeposit(getDecimalAmount(amount, tokenDecimals ).toString(), durationIndex)
      if(onAdd) onAdd()
      toastSuccess(
        `${t('Congratulations')}!`,
        t('You Added Item !!! '),
      )
    }catch(err){      
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
  return (
    <Modal
      title={t('Add Item') }
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    
    >     
    <Text> {t('Period')} / {t('days')} </Text>
    {
      durationOptions.length !==0 &&
        <Select
        options={durationOptions}
        onOptionChange={handleOptionChange}
      />
    }
    
    <Flex alignItems="center" justifyContent="space-between" mb="8px" mt={4}>
        <Text bold>{t('Amount')}:</Text>
        <Flex alignItems="center" minWidth="70px">          
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

      <Button
        isLoading={pendingTx}
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
