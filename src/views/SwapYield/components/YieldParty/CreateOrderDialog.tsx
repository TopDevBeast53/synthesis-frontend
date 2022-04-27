import BigNumber from 'bignumber.js'
import Select from 'components/Select/Select'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import React, { useState } from 'react'
import { usePriceHelixBusd } from 'state/farms/hooks'
import {
    AutoRenewIcon,
    BalanceInput, Button,
    Flex, Modal, Slider, Text
} from 'uikit'
import { formatNumber, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { useHelixYieldSwap } from 'hooks/useContract'
import PercentageButton from './PercentageButton'
// const AddRowModal = ({
//   availableBalance,
//   onDismiss
// }) => {
//   const { t } = useTranslation()
//   const { theme } = useTheme()
//   const tokenDecimals = tokens.helix.decimals
//   const tokenSymbol = tokens.helix.symbol
//   const [pendingTx, setPendingTx] = useState(false)
//   const cakePrice = usePriceHelixBusd()
//   const [selectedAmount, setSelectedAmount] = useState('')
//   const [hasReachedStakeLimit] = useState(false)
//   const [percent, setPercent] = useState(0)
//   const usdValueOfSelectedAmount = new BigNumber(selectedAmount).times(cakePrice)  
//   const formattedUsdValueOfSelectedAmount = !usdValueStaked.isNaN() && formatNumber(usdValueOfSelectedAmount.toNumber())  
//   const fullDecimalselectedAmount = getDecimalAmount(new BigNumber(selectedAmount), tokenDecimals)
//   const userNotEnoughToken = availableBalance.lt(fullDecimalselectedAmount)  
//   const { toastSuccess, toastError } = useToast()  
//   const [durationOptions, setDurationOptions] = useState([])
//   const [durationIndex, setDurationIndex]=useState(0)  
     
//   const handleStakeInputChange = (input: string) => {
//     if (input) {
//       const convertedInput = getDecimalAmount(new BigNumber(input), tokenDecimals)
//       const percentage = Math.floor(convertedInput.dividedBy(availableBalance).multipliedBy(100).toNumber())
//       setPercent(Math.min(percentage, 100))
//     } else {
//       setPercent(0)
//     }
//     setSelectedAmount(input)
//   }

//   const handleChangePercent = (sliderPercent: number) => {
//     if (sliderPercent > 0) {
//       const percentageOfStakingMax = availableBalance.dividedBy(100).multipliedBy(sliderPercent)
//       const amountToStake = getFullDisplayBalance(percentageOfStakingMax, tokenDecimals, tokenDecimals)
//       setSelectedAmount(amountToStake)
//     } else {
//       setSelectedAmount('')
//     }
//     setPercent(sliderPercent)
//   }
//   const handleOptionChange = (option) => {
//     setDurationIndex(option.value)    
//   }
//   return (
//     <Modal
//       title={t('Add Item') }
//       onDismiss={onDismiss}
//       headerBackground={theme.colors.gradients.cardHeader}
    
//     >     
//     <Text> {t('Period')} / {t('days')} </Text>
//     {
//       durationOptions.length !==0 &&
//         <Select
//         options={durationOptions}
//         onOptionChange={handleOptionChange}
//       />
//     }
    
//     <Flex alignItems="center" justifyContent="space-between" mb="8px" mt={4}>
//         <Text bold>{t('Amount')}:</Text>
//         <Flex alignItems="center" minWidth="70px">          
//           <Text ml="4px" bold>
//             {t('Helix')}
//           </Text>
//         </Flex>
//       </Flex>
//       <BalanceInput
//         value={selectedAmount}
//         onUserInput={handleStakeInputChange}
//         currencyValue={cakePrice.gt(0) && `~${formattedUsdValueStaked || 0} USD`}
//         isWarning={hasReachedStakeLimit || userNotEnoughToken}
//         decimals={tokenDecimals}
//       />
//       {hasReachedStakeLimit && (
//         <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
//           {t('Maximum total stake: %amount% %token%', {
//             amount: getFullDisplayBalance(new BigNumber(availableBalance), tokenDecimals, 0),
//             token: tokenSymbol,
//           })}
//         </Text>
//       )}
//       {userNotEnoughToken && (
//         <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
//           {t('Insufficient %symbol% balance', {
//             symbol: tokenSymbol,
//           })}
//         </Text>
//       )}
//       <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
//         {t('Balance: %balance%', {
//           balance: getFullDisplayBalance(availableBalance, tokenDecimals),
//         })}
//       </Text>
//       <Slider
//         min={0}
//         max={100}
//         value={percent}
//         onValueChanged={handleChangePercent}
//         name="stake"
//         valueLabel={`${percent}%`}
//         step={1}
//       />
//       <Flex alignItems="center" justifyContent="space-between" mt="8px">
//         <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
//       </Flex>

//       <Button
//         isLoading={pendingTx}
//         endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}        
//         mt="24px"
//       >
//         {pendingTx ? t('Confirming') : t('Confirm')}
//       </Button>
//       <Button variant="text" onClick={onDismiss} pb="0px">
//         {t('Close Window')}
//       </Button>
//     </Modal>
//   )
// }
const AddRowModal = (props)=>{
  const { theme } = useTheme()
  const { t } = useTranslation()
  const {onDismiss} = props
  const yieldSwapContract = useHelixYieldSwap()

  console.debug('????', yieldSwapContract)

  const [uAmount, setUAmount]=useState(0.0)
  const [yAmount, setYAmount]=useState(0.0)
  const [duration, setDuration]=useState()
  const [durationIndex, setDurationIndex]=useState(0)
  const [pendingTx, setPendingTx] = useState(false)
  const handleUAmountChange = (input) => {
    setUAmount(input)
  }
  const handleYAmountChange = (input) => {
    setYAmount(input)
  }
  const handleOptionChange = (option) => {
    setDurationIndex(option.value)
  }
  const handleConfirm = () => {
    setPendingTx(true);
    setPendingTx(false);
    onDismiss()
  }
  const durationOptions=[{
      label:"1 day",
      value:"1"
    },
    {
      label:"2 day",
      value:"2"
    },
    {
      label:"3 day",
      value:"3"
    }    
  ]

  return (
    <Modal
      title={t('Add Item') }
      headerBackground={theme.colors.gradients.cardHeader}    
      onDismiss={onDismiss}
    > 
      <Text bold>{t('Duration')}:</Text>
      {
        durationOptions.length !==0 &&
          <Select
          options={durationOptions}
          onOptionChange={handleOptionChange}
        />
      }
      <Text bold>{t('U Amount')}:</Text>      
      <BalanceInput 
            value={uAmount}
            onUserInput={handleUAmountChange}
      />
      <Text bold>{t('Y Amount')}:</Text>
      <BalanceInput 
          value={uAmount}
          onUserInput={handleYAmountChange}
      />
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}       
        onClick={handleConfirm} 
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

