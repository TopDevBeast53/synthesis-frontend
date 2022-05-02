import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Select from 'components/Select/Select'
import { Erc20 } from 'config/abi/types'
import { useTranslation } from 'contexts/Localization'
import { ethers } from 'ethers'
import { useERC20s, useHelixLpSwap } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import React, { useEffect, useMemo, useState } from 'react'
import { useMemoFarms } from 'state/farms/hooks'
import {
  AutoRenewIcon, BalanceInput, Button, Modal, Text
} from 'uikit'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getDecimalAmount } from 'utils/formatBalance'
  

const AddRowModal = (props)=>{
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const {account} = useWeb3React()
  const {onDismiss} = props

  const [uAmount, setUAmount]=useState(0)
  const [yAmount, setYAmount]=useState(0)  
  const [pendingTx, setPendingTx] = useState(false)
  const LpSwapContract = useHelixLpSwap()    
  const { data: farmsLP } = useMemoFarms()
  
  const [LPOptions, setLPOptions] = useState<any>() 
  const [selectedLPOption, setSelectedLPOption] = useState<any>()  
  const [selectedLPBuyOption, setSelectedLPBuyOption] = useState<any>()
  const handleUAmountChange = (input) => {
    setUAmount(input)
  }
  const handleYAmountChange = (input) => {
    setYAmount(input)
  }  
  const handleLPChange = (option) => {
    setSelectedLPOption(option)    
  }
  const handleBuyOptionChange = (option) => { setSelectedLPBuyOption(option.value)}
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
    if(!selectedLPBuyOption || ! selectedLPOption) return 
    const selectedLPContract:Erc20 = selectedLPOption.contract
    const selectedLPAllowance = selectedLPOption.allowance
         
    async function DoValidation(){
      if (uAmount === 0 || yAmount === 0){
        toastError('Error', `Both Token Amount Should be bigger than Zero`)
        return false
      }      
      return true
    }
    if (selectedLPAllowance.lte(BIG_ZERO)){
      const decimals = await selectedLPContract.decimals()      
      setPendingTx(true); 
      
      selectedLPContract.approve(LpSwapContract.address, ethers.constants.MaxUint256).then( async (tx)=>{        
        await tx.wait()
        toastSuccess(
          `${t('Congratulations')}!`,
            t('You Apporved  !!! '),
        )        
        selectedLPOption.allowance=getDecimalAmount(new BigNumber(Number.POSITIVE_INFINITY), decimals)
        setSelectedLPOption({...selectedLPOption})
        setPendingTx(false)
      }).catch(err=>{
        toastError('Error', err.toString())
        setPendingTx(false)
      })
      return 
    }
    if(!await DoValidation()) return 
    setPendingTx(true); 
    console.debug('???', selectedLPBuyOption)
    LpSwapContract.openSwap(selectedLPOption.contract.address, selectedLPBuyOption.contract.address, uAmount, yAmount).then(async (tx)=>{
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
      return lpContract.allowance(account, LpSwapContract.address)
    })
    Promise.all(allowanceContracts).then((allowances) => {      
      
      for(let i =0; i< tempLPOptions.length; i ++){
        tempLPOptions[i].allowance = new BigNumber(allowances[i].toString())
        tempLPOptions[i].contract = lpContracts[i]
      }      
      setLPOptions(tempLPOptions)
      if(!selectedLPOption) setSelectedLPOption(tempLPOptions[0])
      if(!selectedLPBuyOption) setSelectedLPBuyOption(tempLPOptions[1])
    })
  }, [LpSwapContract.address, account, lpContracts, tempLPOptions, selectedLPOption, selectedLPBuyOption])

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
      <Select options={LPOptions} defaultOptionIndex={1} onOptionChange={handleBuyOptionChange}/>
      
      <Text bold>{t('Token Amount')}:</Text>
      <BalanceInput 
          value={yAmount}
          onUserInput={handleYAmountChange}
      />      
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

