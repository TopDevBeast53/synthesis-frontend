import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useAllTokens } from 'hooks/Tokens'
import { useERC20s, useHelixLpSwap } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import React, { useEffect, useMemo, useState } from 'react'
import { useMemoFarms } from 'state/farms/hooks'
import { useAllTokenBalances } from 'state/wallet/hooks'
import { Modal } from 'uikit'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import BaseOpenSwap from './BaseOpenSwap'

const CreateOrderDialog = (props) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { onDismiss } = props

  const LpSwapContract = useHelixLpSwap()
  const { data: farmsLP } = useMemoFarms()
  const tokens = useAllTokens()
  const allTokenBalances = useAllTokenBalances()
  const [allOptions, setAllOptions] = useState<any>()

  const [tempAllOptions, addressList] = useMemo(() => {
    const lpOptions = farmsLP
      .filter((lp) => lp.pid !== 0)
      .map((lp) => ({
        label: lp.lpSymbol,
        value: lp,
        address: lp.lpAddress,
        decimals: lp.token.decimals,
        maxBalance: getBalanceAmount(lp.userData.tokenBalance, lp.token.decimals),
        allowance: BIG_ZERO,
        contract: undefined,
      }))
    const tokenOptions = Object.keys(tokens).map((key) => ({
      label: tokens[key].symbol,
      value: tokens[key],
      address: tokens[key].address,
      decimals: tokens[key].decimals,
      maxBalance: allTokenBalances[key] ? new BigNumber(allTokenBalances[key].toExact()) : BIG_ZERO,
      allowance: BIG_ZERO,
      contract: undefined,
    }))
    const tempOptions = [...lpOptions, ...tokenOptions]
    const lpAddressesList = lpOptions.map((option) => {
      return option.value.lpAddress
    })
    const tokenAddressList = tokenOptions.map((option) => {
      return option.value.address
    })
    const addrlist = [...lpAddressesList, ...tokenAddressList]

    return [tempOptions, addrlist]
  }, [farmsLP, tokens, allTokenBalances])

  const allContracts = useERC20s(addressList)

  useEffect(() => {
    let unmounted = false
    const allowanceContracts = allContracts.map((contract) => {
      return contract.allowance(account, LpSwapContract.address)
    })
    Promise.all(allowanceContracts).then((allowances) => {
      for (let i = 0; i < tempAllOptions.length; i++) {
        tempAllOptions[i].allowance = new BigNumber(allowances[i].toString())
        tempAllOptions[i].contract = allContracts[i]
      }
      if (unmounted) return
      setAllOptions(tempAllOptions)
    })
    return () => {
      unmounted = true
    }
  }, [LpSwapContract.address, account, allContracts, tempAllOptions])

  const handleConfirm = (toBuyerTokenAddress, toSellerTokenAddress, decimalUAmount, decimalYAmount) => {
    return LpSwapContract.openSwap(
      toBuyerTokenAddress,
      toSellerTokenAddress,
      decimalUAmount.toString(),
      decimalYAmount.toString(),
    )
  }
  const propData = {
    toBuyerTokenOptions: allOptions,
    toSellerTokenOptions: allOptions,
    hidDuration: true,
    contractAddress: LpSwapContract.address,
    onDismiss,
    handleConfirm
  }
  if (!allOptions) return null
  return (
    <Modal title={t('Create Swap')} headerBackground={theme.colors.gradients.cardHeader} onDismiss={onDismiss}>
      <BaseOpenSwap {...propData} />
    </Modal>
  )
}
export default CreateOrderDialog
