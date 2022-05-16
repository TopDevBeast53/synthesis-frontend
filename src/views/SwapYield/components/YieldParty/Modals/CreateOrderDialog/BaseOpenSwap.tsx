import BigNumber from 'bignumber.js';
import { ModalInput } from 'components/Modal';
import Select from 'components/Select/Select';
import { useTranslation } from 'contexts/Localization';
import { ethers } from 'ethers';
import { useHelixYieldSwap } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AutoRenewIcon, BalanceInput, Button, Input, Skeleton, Text } from 'uikit';
import { BIG_ZERO } from 'utils/bigNumber';
import { getDecimalAmount } from 'utils/formatBalance';
import Group from 'views/SwapYield/components/GroupComponent';

const StyledInput = styled(Input)`
  ::-webkit-inner-spin-button {
    -webkit-appearance: auto;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: auto;
    margin: 0;
  }
`
const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`
const getInitialOption = (options)=>{
    if (!options || options.length === 0) return undefined    
    return options[0]
}
export default (props)=>{
    const { t } = useTranslation()
    const {toBuyerTokenOptions, minDuration, maxDuration, 
        toSellerTokenOptions, onDismiss, isToBuyerTokenLp, isToSellerTokenLp,
     } = props
    const { toastSuccess, toastError } = useToast()
    const [uAmount, setUAmount] = useState('0')
    const [yAmount, setYAmount] = useState('0')
    const [pendingTx, setPendingTx] = useState(false)
    const YieldSwapContract = useHelixYieldSwap()
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

    const [selectedDuration, setSelectedDuration] = useState(1)
    const [selectedToBuyerTokenOption, setSelectedToBuyerTokenOption] = useState<any>(getInitialOption(toBuyerTokenOptions))    
    const [selectedToSellerTokenOption, setSelectedToSellerTokenOption] = useState<any>(getInitialOption(toSellerTokenOptions))
    
    const handleToBuyerTokenOptionChange=(option)=>{
        setSelectedToBuyerTokenOption(option)
    }
    const handleToSellerTokenOptionChange=(option)=>{
        setSelectedToSellerTokenOption(option)
    }
    const maxBalanceOfToBuyerToken = selectedToBuyerTokenOption ? 
                                        selectedToBuyerTokenOption.maxBalance :
                                        BIG_ZERO
                                            
    const handleSelectMaxOfToBuyerToken = useCallback(() => {
        setUAmount(maxBalanceOfToBuyerToken.toString())
      }, [maxBalanceOfToBuyerToken, setUAmount])

    const handleDurationChange = (input) => {
        setSelectedDuration(input.target.value)
    }
    const decimalUAmount = getDecimalAmount(new BigNumber(uAmount))
    const decimalYAmount = getDecimalAmount(new BigNumber(yAmount))
    
    const hasToApprove = selectedToBuyerTokenOption?.allowance.lte(0) || selectedToBuyerTokenOption?.allowance.lte(decimalUAmount)
    const doApprove = async () => {
        const Erc20Contract = selectedToBuyerTokenOption.contract
        const decimals = await Erc20Contract.decimals()
        setPendingTx(true)
        Erc20Contract.approve(YieldSwapContract.address, ethers.constants.MaxUint256)
        .then(async (tx) => {
          await tx.wait()
          toastSuccess(`${t('Success')}!`, t('Approved!'))
          selectedToBuyerTokenOption.allowance = getDecimalAmount(new BigNumber(Number.POSITIVE_INFINITY), decimals)
          setSelectedToBuyerTokenOption({ ...selectedToBuyerTokenOption })
          setPendingTx(false)
        })
        .catch((err) => {
          toastError('Error', err.toString())
          setPendingTx(false)
        })
    }
    async function DoValidation() {
        if (uAmount === '0' || yAmount === '0') {
          toastError('Error', `Both Token Amount Should be bigger than Zero`)
          return false
        }
        if (maxBalanceOfToBuyerToken.lt(uAmount)) {
          toastError('Error', `${selectedToBuyerTokenOption.label} amount is over limit`)
          return false
        }
        if (selectedDuration > maxDuration || selectedDuration < minDuration) {
          toastError('Error', `Duration should be in range between ${minDuration} and ${maxDuration}`)
          return false
        }
        return true
    }
    const handleBtnClick = async ()=>{
        if (hasToApprove) {            
            doApprove()
        } 
        else {
            if (!(await DoValidation())) return
            setPendingTx(true)
            console.info("========", selectedToBuyerTokenOption, selectedToSellerTokenOption)
            console.info("========", isToBuyerTokenLp, isToSellerTokenLp)
            YieldSwapContract.openSwap(
              selectedToBuyerTokenOption.address,
              selectedToSellerTokenOption.address,
              decimalUAmount.toString(),
              decimalYAmount.toString(),
              Math.round(3600 * 24 * selectedDuration),
              isToBuyerTokenLp, isToSellerTokenLp
            )
              .then(async (tx) => {
                await tx.wait()
                setPendingTx(false)
                toastSuccess(`${t('Success')}!`, t('Order has been created!'))
                if (onDismiss) onDismiss()
              })
              .catch((err) => {
                setPendingTx(false)
                toastError('Error', err.toString())
            })
        }
    }
    return (
        <>
        <Group style={{ margin: '2em 0' }} title="Send">
            <Flex>
            <Text bold style={{ flex: '3' }}>
                {isToBuyerTokenLp ? t('LP Token') : t('Token')}:
            </Text>
            <Select options={toBuyerTokenOptions} onOptionChange={handleToBuyerTokenOptionChange} style={{ zIndex: '30', flex: '6' }} />
            </Flex>

            <div style={{ marginBottom: '1em' }}>
            {selectedToBuyerTokenOption ? (
                <ModalInput
                value={uAmount.toString()}
                onSelectMax={handleSelectMaxOfToBuyerToken}
                onChange={handleUAmountChange}
                max={maxBalanceOfToBuyerToken.toString()}
                symbol={selectedToBuyerTokenOption?.label}
                addLiquidityUrl="#"
                inputTitle={t('Amount')}
                />
            ) : (
                <Skeleton />
            )}
            </div>
            <Flex>
            {/* <Text bold style={{ flex: '3' }}>
                {t('Estimated Price')}:{' '}
            </Text>
            <Text style={{ flex: '3' }} color="primary">
                ~ {getEstimatedPrice(selectedLpPrice, uAmount).toString()}
            </Text> */}
            </Flex>
           
        </Group>
        <Group title="Receive" style={{ marginBottom: '2em' }}>
            <Flex>
            <Text bold style={{ flex: '3' }}>
              {isToSellerTokenLp ? t('LP Token') : t('Token')}:
            </Text>
            <Select style={{ flex: '6' }} options={toSellerTokenOptions} onOptionChange={handleToSellerTokenOptionChange} />
            </Flex>

            <Flex>
            <Text bold style={{ flex: '3' }}>
                {t('Amount')}:
            </Text>
            <BalanceInput style={{ flex: '6' }} value={yAmount} onUserInput={handleYAmountChange}/>
            </Flex>
        </Group>
        <Flex>
            <Text bold style={{ flex: '3 3 120px' }}>
                {t('Duration (days)')}:
            </Text>
            <StyledInput
                style={{ flex: '7 7' }}
                type="number"
                max={maxDuration}
                min={minDuration}
                value={selectedDuration}
                onChange={handleDurationChange}
            />
        </Flex>
        <Button
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={handleBtnClick}
            mt="24px"
        >
            {pendingTx ? (hasToApprove ? 'Approving' : t('Confirming')) : hasToApprove ? 'Approve' : t('Confirm')}
         </Button>
        </>
        
    )
}
