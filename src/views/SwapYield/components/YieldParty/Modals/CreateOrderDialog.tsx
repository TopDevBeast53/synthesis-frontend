import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Select from 'components/Select/Select'
import { Erc20 } from 'config/abi/types'
import { useTranslation } from 'contexts/Localization'
import { useAllTokens } from 'hooks/Tokens'
import { useERC20s, useHelixYieldSwap } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import React, { useEffect, useMemo, useState } from 'react'
import { Token } from 'sdk'
import { useMemoFarms } from 'state/farms/hooks'
import styled from 'styled-components'
import {
  AutoRenewIcon, BalanceInput, Button, Input, Modal, Text
} from 'uikit'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getDecimalAmount } from 'utils/formatBalance'


const StyledInput = styled(Input)`        
        ::-webkit-inner-spin-button{
            -webkit-appearance: auto; 
            margin: 0; 
        }
        ::-webkit-outer-spin-button{
            -webkit-appearance: auto; 
            margin: 0; 
        }   
    `    

const AddRowModal = (props)=>{
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const {account} = useWeb3React()
  const {onDismiss} = props

  const [uAmount, setUAmount]=useState(0)
  const [yAmount, setYAmount]=useState(0)
  const [duration, setDuration]=useState(1)  
  const [pendingTx, setPendingTx] = useState(false)
  const YieldSwapContract = useHelixYieldSwap()  
  const allTokens = useAllTokens() // All Stable Token  
  const { data: farmsLP } = useMemoFarms()
  
  const [LPOptions, setLPOptions] = useState<any>()
 
  const TokenOptions = Object.keys(allTokens).map((key)=>{
    return {
      "label": allTokens[key].symbol,
      "value": allTokens[key]
    }
  })
  const [selectedLPOption, setSelectedLPOption] = useState<any>()
  
  const [selectedToken, setSelectedToken] = useState<Token>(TokenOptions[0].value)
  const [minDuration, setMinDuration] = useState(0)
  const [maxDuration, setMaxDuration] = useState(0)
  
  
  const handleUAmountChange = (input) => {
    setUAmount(input)
  }
  const handleYAmountChange = (input) => {
    setYAmount(input)
  }  
  const handleLPChange = (option) => {
    setSelectedLPOption(option)    
  }
  const handleTokenChange = (option) => { setSelectedToken(option.value)}
  const handleDurationChange = (input) => {    
    setDuration(input.target.value)
  }
  
  const [tempLPOptions, lpAddressList] = useMemo(()=>{
    const lpOptions= farmsLP.filter(lp=>lp.pid!==0).map(lp=>    
      (
        {
          label: lp.lpSymbol,
          value: lp,
          allowance:BIG_ZERO,
          contract:undefined
        }
      )
    )
    const addressList =  lpOptions.map((option)=>{
      return getAddress(option.value.lpAddresses)
    })
    return [lpOptions, addressList]
  },[farmsLP])
  
  const lpContracts = useERC20s(lpAddressList)


  const handleConfirm = async () => {    
    if(!selectedToken || ! selectedLPOption) return 
    const selectedLP = selectedLPOption.value
    const selectedLPContract:Erc20 = selectedLPOption.contract
    const selectedLPAllowance = selectedLPOption.allowance
    setPendingTx(true);   
    async function DoValidation(){
      if (uAmount === 0 || yAmount === 0){
        toastError('Error', `Both Token Amount Should be bigger than Zero`)
        return false
      }  
      if (duration > maxDuration || duration < minDuration){
        toastError('Error', `Duration should be in range between ${minDuration} and ${maxDuration}`)
        return false
      }        
      return true
    }
    if (selectedLPAllowance.lte(BIG_ZERO)){
      const decimals = await selectedLPContract.decimals()
      const decimalUAmount = getDecimalAmount(new BigNumber(uAmount), decimals)
      selectedLPContract.approve(YieldSwapContract.address, decimalUAmount.toString()).then( async (tx)=>{        
        await tx.wait()
        toastSuccess(
          `${t('Congratulations')}!`,
            t('You Apporved  !!! '),
        )        
        selectedLPOption.allowance=decimalUAmount
        setSelectedLPOption({...selectedLPOption})
        setPendingTx(false)
      }).catch(err=>{
        toastError('Error', err.toString())
        setPendingTx(false)
      })
      return 
    }
    if(!await DoValidation()) return 

    YieldSwapContract.openSwap(selectedToken.address, selectedLP.pid, uAmount, yAmount, 3600 * 24* duration).then(async (tx)=>{
      await tx.wait()
      setPendingTx(false);
      toastSuccess(
          `${t('Congratulations')}!`,
          t('You Added Item !!! '),
      )
      if(onDismiss) onDismiss()

    }).catch(err=>{
      setPendingTx(false); 
      toastError('Error', err.toString())

    })
  }

  useEffect(()=>{
    const allowanceContracts = lpContracts.map((lpContract)=>{
      return lpContract.allowance(account, YieldSwapContract.address)
    })
    Promise.all(allowanceContracts).then((allowances) => {      
      
      for(let i =0; i< tempLPOptions.length; i ++){
        tempLPOptions[i].allowance = new BigNumber(allowances[i].toString())
        tempLPOptions[i].contract = lpContracts[i]
      }      
      setLPOptions(tempLPOptions)
      if(!selectedLPOption) setSelectedLPOption(tempLPOptions[0])
    })
  }, [YieldSwapContract.address, account, lpContracts, tempLPOptions, selectedLPOption])

  useEffect(()=>{
    Promise.all([YieldSwapContract.MIN_LOCK_DURATION(), YieldSwapContract.MAX_LOCK_DURATION()]).then((values) => {      
      setMinDuration(values[0].toNumber()/24/3600)
      setMaxDuration(values[1].toNumber()/24/3600)
    })
  }, [YieldSwapContract, account])

  if (!LPOptions) return null
  return (
    <Modal
      title={t('Add Item') }
      headerBackground={theme.colors.gradients.cardHeader}    
      onDismiss={onDismiss}
    > 
      
      <Text bold>{t('LP Token')}:</Text>           
      <Select options={LPOptions} onOptionChange={handleLPChange} style={{zIndex:"30"}}/>
      
      <Text bold>{t('LP Token Amount')}:</Text>
      <BalanceInput 
            value={uAmount}
            onUserInput={handleUAmountChange}
      />
      <Text bold>{t('Token')}:</Text>                 
      <Select options={TokenOptions} onOptionChange={handleTokenChange}/>
      
      <Text bold>{t('Token Amount')}:</Text>
      <BalanceInput 
          value={yAmount}
          onUserInput={handleYAmountChange}
      />
      <Text bold>{t('Duration (days)')}:</Text>
      <StyledInput type="number" max={maxDuration} min={minDuration} value={duration}  onChange={handleDurationChange}/>
      
      <Button
        isLoading={pendingTx}    
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirm} 
        mt="24px"
      >
        {pendingTx ? selectedLPOption?.allowance.lte(0) ? "Approving" :t('Confirming') : selectedLPOption?.allowance.lte(0)? "Approve" : t('Confirm')}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        Close Window
      </Button>
    </Modal>
  )
}
export default AddRowModal

