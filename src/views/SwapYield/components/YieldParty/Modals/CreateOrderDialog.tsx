import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ModalInput } from 'components/Modal'
import Select from 'components/Select/Select'
import { Erc20 } from 'config/abi/types'
import { useTranslation } from 'contexts/Localization'
import { ethers } from 'ethers'
import { useAllTokens } from 'hooks/Tokens'
import { useERC20s, useHelixYieldSwap } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Token } from 'sdk'
import { useMemoFarms } from 'state/farms/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import styled from 'styled-components'
import {
  AutoRenewIcon, BalanceInput, Button, Input, Modal, Skeleton, Text
} from 'uikit'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount, getBalanceNumber, getDecimalAmount } from 'utils/formatBalance'
import getEstimatedPrice from 'utils/getEstimatedPrice'
import Group from '../../GroupComponent'


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
const Flex = styled.div`
display:flex;
align-items:center;
margin-bottom:0.5em;
`
const AddRowModal = (props)=>{
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const {account} = useWeb3React()
  const {onDismiss} = props

  const [uAmount, setUAmount]=useState("0")
  const [yAmount, setYAmount]=useState("0")
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
  const maxBalanceOfLP = getBalanceAmount(selectedLPOption?.value.userData.tokenBalance)
  const selectedLpPrice = selectedLPOption? new BigNumber(selectedLPOption?.value.tokenPriceBusd) : BIG_ZERO

  const [selectedToken, setSelectedToken] = useState<Token>(TokenOptions[0].value)

  const [minDuration, setMinDuration] = useState(0)
  const [maxDuration, setMaxDuration] = useState(0)
  
  useTokenBalance()
  const handleUAmountChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setUAmount(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setUAmount],
  )

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

  const decimalUAmount = getDecimalAmount(new BigNumber(uAmount))
  const decimalYAmount = getDecimalAmount(new BigNumber(yAmount))
  const handleConfirm = async () => {    
    if(!selectedToken || ! selectedLPOption) return 
    const selectedLP = selectedLPOption.value
    const selectedLPContract:Erc20 = selectedLPOption.contract
    const selectedLPAllowance = selectedLPOption.allowance
    async function DoValidation(){
      if (uAmount === "0" || yAmount === "0"){
        toastError('Error', `Both Token Amount Should be bigger than Zero`)
        return false
      }
      if (maxBalanceOfLP.lt(uAmount)){
        toastError('Error', `${selectedLP.lpSymbol} amount is over limit`)
        return false
      }
      if (duration > maxDuration || duration < minDuration){
        toastError('Error', `Duration should be in range between ${minDuration} and ${maxDuration}`)
        return false
      }        
      return true
    }
    

    if (selectedLPAllowance.lte(decimalUAmount)){
      setPendingTx(true);
      const decimals = await selectedLPContract.decimals()      
      selectedLPContract.approve(YieldSwapContract.address, ethers.constants.MaxUint256).then( async (tx)=>{        
        await tx.wait()
        toastSuccess(
          `${t('Success')}!`,
            t('Approved!'),
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
    YieldSwapContract.openSwap(selectedToken.address, selectedLP.pid, decimalUAmount.toString(), decimalYAmount.toString(), Math.round(3600 * 24* duration)).then(async (tx)=>{
      await tx.wait()
      setPendingTx(false);
      toastSuccess(
          `${t('Success')}!`,
          t('Order has been created!'),
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
  
  const handleSelectMaxOfLPToken = useCallback(() => {
    setUAmount(maxBalanceOfLP.toString())
  }, [maxBalanceOfLP, setUAmount])

    const hasToApprove =  selectedLPOption?.allowance.lte(0) || selectedLPOption?.allowance.lte(decimalUAmount)
  if (!LPOptions) return null
  return (
    <Modal
      title={t('Add an Order') }
      headerBackground={theme.colors.gradients.cardHeader}    
      onDismiss={onDismiss}
    > 
    <Group style={{marginBottom:"2em"}} title="Send">
      <Flex>
        <Text bold style={{flex:"3"}}>{t('LP Token')}:</Text>           
        <Select options={LPOptions} onOptionChange={handleLPChange} style={{zIndex:"30", flex:"6"}}/>
      </Flex>
      
      <div style={{marginBottom:"1em"}}>
        {selectedLPOption? 
          <ModalInput
            value={uAmount.toString()}
            onSelectMax={handleSelectMaxOfLPToken}
            onChange={handleUAmountChange}
            max={maxBalanceOfLP.toString()}
            symbol={selectedLPOption?.label}
            addLiquidityUrl="#"
            inputTitle={t('Amount')}
          />
          :
          <Skeleton/>
        }
      </div>
      <Flex>
        <Text bold style={{flex:"3"}}>{t('Estimated Price')}:  </Text>
        <Text style={{flex:"3"}} color="primary">~ {getEstimatedPrice(selectedLpPrice, uAmount).toString()}</Text>
      </Flex>
      <Flex>
        <Text bold style={{flex:"3 3 120px"}}>{t('Duration (days)')}:</Text>
        <StyledInput style={{flex:"7 7"}} type="number" max={maxDuration} min={minDuration} value={duration}  onChange={handleDurationChange}/>
      </Flex>
    </Group>
    <Group title="Receive">
      <Flex>
        <Text bold style={{flex:"3"}}>{t('Exchange')}:</Text>                 
        <Select style={{flex:"6"}} options={TokenOptions} onOptionChange={handleTokenChange}/>
      </Flex>

      <Flex>
        <Text bold style={{flex:"3"}}>{t('Amount')}:</Text>
        <BalanceInput 
            style={{flex:"6"}}
            value={yAmount}
            onUserInput={handleYAmountChange}
        />
      </Flex>
    </Group>
      
      
      
      <Button
        isLoading={pendingTx}    
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirm} 
        mt="24px"
      >
        {pendingTx ? hasToApprove ? "Approving" :t('Confirming') : hasToApprove? "Approve" : t('Confirm')}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        Close Window
      </Button>
    </Modal>
  )
}
export default AddRowModal

