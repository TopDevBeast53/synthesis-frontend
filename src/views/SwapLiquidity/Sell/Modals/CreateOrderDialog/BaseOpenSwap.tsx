import BigNumber from 'bignumber.js';
import { ModalInput } from 'components/Modal';
import NumberInput from 'components/NumberInput';
import Select from 'components/Select/Select';
import { useTranslation } from 'contexts/Localization';
import { ethers } from 'ethers';
import useToast from 'hooks/useToast';
import React, { useCallback, useState } from 'react';
import { AutoRenewIcon, Button, Skeleton, Text, Flex } from 'uikit';
import { BIG_ZERO } from 'utils/bigNumber';
import { getDecimalAmount } from 'utils/formatBalance';
import handleError from 'utils/handleError';
import Group from 'views/SwapYield/components/GroupComponent';

const getInitialOption = (options) => {
  if (!options || options.length === 0) return undefined
  return options[0]
}
export default (props) => {
  const { t } = useTranslation()
  const { toBuyerTokenOptions, toSellerTokenOptions, onDismiss, handleConfirm, contractAddress } = props
  const { toastSuccess, toastError } = useToast()
  const [uAmount, setUAmount] = useState('')
  const [yAmount, setYAmount] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const handleUAmountChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setUAmount(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setUAmount],
  )
  const handleYAmountChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setYAmount(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setYAmount],
  )

  const [selectedToBuyerTokenOption, setSelectedToBuyerTokenOption] = useState<any>(getInitialOption(toBuyerTokenOptions))
  const [selectedToSellerTokenOption, setSelectedToSellerTokenOption] = useState<any>(getInitialOption(toSellerTokenOptions))

  const handleToBuyerTokenOptionChange = (option) => {
    setSelectedToBuyerTokenOption(option)
  }
  const handleToSellerTokenOptionChange = (option) => {
    setSelectedToSellerTokenOption(option)
  }
  const maxBalanceOfToBuyerToken = selectedToBuyerTokenOption ?
    selectedToBuyerTokenOption.maxBalance :
    BIG_ZERO

  const handleSelectMaxOfToBuyerToken = useCallback(() => {
    setUAmount(maxBalanceOfToBuyerToken.toString())
  }, [maxBalanceOfToBuyerToken, setUAmount])

  const decimalUAmount = getDecimalAmount(new BigNumber(uAmount), selectedToBuyerTokenOption?.decimals)
  const decimalYAmount = getDecimalAmount(new BigNumber(yAmount), selectedToSellerTokenOption?.decimals)

  const hasToApprove = selectedToBuyerTokenOption?.allowance.lte(0) || selectedToBuyerTokenOption?.allowance.lte(decimalUAmount)
  const doApprove = async () => {
    const Erc20Contract = selectedToBuyerTokenOption.contract
    const decimals = await Erc20Contract.decimals()
    setPendingTx(true)
    Erc20Contract.approve(contractAddress, ethers.constants.MaxUint256)
      .then(async (tx) => {
        await tx.wait()
        toastSuccess(`${t('Success')}!`, t('Approved!'))
        selectedToBuyerTokenOption.allowance = getDecimalAmount(new BigNumber(Number.POSITIVE_INFINITY), decimals)
        setSelectedToBuyerTokenOption({ ...selectedToBuyerTokenOption })
        setPendingTx(false)
      })
      .catch((err) => {
        setPendingTx(false)
        handleError(err, toastError)
      })
  }
  async function DoValidation() {
    if (uAmount === '' || yAmount === '') {
      toastError('Error', `Both Token Amount Should be bigger than Zero`)
      return false
    }
    if (maxBalanceOfToBuyerToken.lt(uAmount)) {
      toastError('Error', `${selectedToBuyerTokenOption.label} amount is over limit`)
      return false
    }
    if (selectedToBuyerTokenOption.address === selectedToSellerTokenOption.address) {
      toastError('Error', `You can't Swap same kind of token`)
      return false
    }
    return true
  }
  const handleBtnClick = async () => {
    if (hasToApprove) {
      doApprove()
    }
    else {
      if (!(await DoValidation())) return
      setPendingTx(true)
      handleConfirm(
        selectedToBuyerTokenOption.address,
        selectedToSellerTokenOption.address,
        decimalUAmount.toString(),
        decimalYAmount.toString()
      )
        .then(async (tx) => {
          await tx.wait()
          setPendingTx(false)
          toastSuccess(`${t('Success')}!`, t('Order has been created!'))
          if (onDismiss) onDismiss()
        })
        .catch((err) => {
          setPendingTx(false)
          handleError(err, toastError)
        })
    }
  }
  return (
    <>
      <Group style={{ margin: '1rem 0', zIndex: "15" }} title="Offer">
        <Flex alignItems="center" mb="18px">
          <Text bold style={{ flex: '3' }}>
            {t('Token (Offering)')}:
          </Text>
          <Select options={toBuyerTokenOptions} onOptionChange={handleToBuyerTokenOptionChange} style={{ flex: '6' }} />
        </Flex>

        {selectedToBuyerTokenOption ? (
          <ModalInput
            placeholder="0.00"
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
      </Group>
      <Group title="Ask" style={{ marginBottom: '1rem' }}>
        <Flex alignItems="center" mb="18px">
          <Text bold style={{ flex: '3' }}>
            {t('Token (Asking)')}:
          </Text>
          <Select style={{ flex: '6' }} options={toSellerTokenOptions} onOptionChange={handleToSellerTokenOptionChange} />
        </Flex>

        <NumberInput
          placeholder="0.00"
          value={yAmount.toString()}
          onChange={handleYAmountChange}
          symbol={selectedToSellerTokenOption?.label}
          inputTitle={t('Amount')}
        />
      </Group>
      <Flex alignItems="center" justifyContent="space-between">
        <Button style={{ flex: 1 }} variant="secondary" onClick={onDismiss} mr="24px">
          Cancel
        </Button>
        <Button
          style={{ flex: 1 }}
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleBtnClick}
        >
          {pendingTx ? (hasToApprove ? 'Approving' : t('Confirming')) : hasToApprove ? 'Approve' : t('Confirm')}
        </Button>
      </Flex>

    </>

  )
}
