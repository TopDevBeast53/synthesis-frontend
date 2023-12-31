import React from 'react'
import { Flex, Text, IconButton, AddIcon, MinusIcon, useModal, Skeleton, Box } from 'uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { DeserializedPool, VaultKey } from 'state/types'
import { usePriceHelixBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import { convertSharesToHelix } from '../../../helpers'
import VaultStakeModal from '../VaultStakeModal'

interface HasStakeActionProps {
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  performanceFee: number
}

const HasSharesActions: React.FC<HasStakeActionProps> = ({ pool, stakingTokenBalance, performanceFee }) => {
  const {
    totalShares,
    userData: { userShares, isLoading },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { stakingToken } = pool
  const { helixAsBigNumber, helixAsNumberBalance } = convertSharesToHelix(userShares, pricePerFullShare)
  const cakePriceBusd = usePriceHelixBusd()
  const stakedDollarValue = cakePriceBusd.gt(0)
    ? getBalanceNumber(helixAsBigNumber.multipliedBy(cakePriceBusd), stakingToken.decimals)
    : 0
  const { t } = useTranslation()

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  )
  const [onPresentUnstake] = useModal(<VaultStakeModal stakingMax={helixAsBigNumber} pool={pool} isRemovingStake />)

  const totalSharesPercentage =
    userShares &&
    userShares.gt(0) &&
    totalShares &&
    userShares.dividedBy(totalShares).multipliedBy(100).decimalPlaces(5)

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column">
        <Balance fontSize="20px" bold value={helixAsNumberBalance} decimals={5} />
        <Text as={Flex} fontSize="12px" color="textSubtle" flexWrap="wrap">
          {cakePriceBusd.gt(0) ? (
            <Balance value={stakedDollarValue} fontSize="12px" color="textSubtle" decimals={2} prefix="~" unit=" USD" />
          ) : (
            <Skeleton mt="1px" height={16} width={64} />
          )}
          {!isLoading && totalSharesPercentage && pool.vaultKey === VaultKey.IfoPool && (
            <Box as="span" ml="2px">
              | {t('%num% of total', { num: `${totalSharesPercentage.toString()}%` })}
            </Box>
          )}
        </Text>
      </Flex>
      <Flex>
        <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
          <MinusIcon color="primary" width="24px" />
        </IconButton>
        <IconButton variant="secondary" onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
          <AddIcon color="primary" width="24px" height="24px" />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default HasSharesActions
