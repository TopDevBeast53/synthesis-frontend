import React from 'react'
import styled from 'styled-components'
import { Flex, useModal, CalculateIcon, Skeleton, FlexProps, Button } from 'uikit'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { usePriceHelixBusd } from 'state/farms/hooks'

const AprLabelContainer = styled(Flex)`
  &:hover {
    opacity: 0.5;
  }
`

interface AprProps extends FlexProps {
  stakedBalance: BigNumber
  showIcon: boolean
  apr: number,
}

const Apr: React.FC<AprProps> = ({ showIcon, stakedBalance, apr = 0 }) => {
  const { t } = useTranslation()
  const helixPrice = usePriceHelixBusd()
  const isFinished = false;

  const apyModalLink = '/swap'

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      earningTokenPrice={helixPrice.toNumber()}
      stakingTokenPrice={helixPrice.toNumber()}
      stakingTokenBalance={stakedBalance}
      apr={apr}
      stakingTokenSymbol="HELIX"
      linkLabel={t('Get %symbol%', { symbol: "HELIX" })}
      linkHref={apyModalLink}
      earningTokenSymbol="HELIX"
      autoCompoundFrequency={0}
      performanceFee={0}
    />,
  )

  const openRoiModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <AprLabelContainer alignItems="center" justifyContent="flex-start">
      {apr || isFinished ? (
        <>
          <Balance
            onClick={openRoiModal}
            fontSize="16px"
            isDisabled={isFinished}
            value={isFinished ? 0 : apr}
            decimals={2}
            unit="%"
          />
          {!isFinished && showIcon && (
            <Button
              onClick={openRoiModal}
              variant="text"
              width="20px"
              height="20px"
              padding="0px"
              marginLeft="4px">
              <CalculateIcon color="textSubtle" width="20px" />
            </Button>
          )}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </AprLabelContainer>
  )
}

export default Apr
