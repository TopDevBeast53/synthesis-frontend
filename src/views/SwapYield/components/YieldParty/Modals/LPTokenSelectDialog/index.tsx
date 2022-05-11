import { CurrencyLogo } from 'components/Logo'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import React from 'react'
import { useFarms } from 'state/farms/hooks'
import { Modal, Text } from 'uikit'

const LPTokenSelecDialog = (props) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { onDismiss } = props
  const { data: farmsLP } = useFarms()
  console.log('========= farms LP ===========', farmsLP)
  const farmLP = farmsLP[0]

  return (
    <Modal title={t('Select a LP Token')} headerBackground={theme.colors.gradients.cardHeader} onDismiss={onDismiss}>
      <div style={{ display: 'flex' }}>
        <TokenPairImage
          variant="inverted"
          primaryToken={farmLP.token}
          secondaryToken={farmLP.quoteToken}
          width={40}
          height={40}
        />
        <Text>{farmLP.lpSymbol}</Text>
      </div>
      {/* <MenuItem
      style={style}
      className={`token-item-${key}`}      
    >
      <CurrencyLogo currency={currency} size="24px" />
      <Column>
        <Text bold>{currency.symbol}</Text>
        <Text color="textSubtle" small ellipsis maxWidth="200px">
          {!isOnSelectedList && customAdded && 'Added by user •'} {currency.name}
        </Text>
      </Column>
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <CircleLoader /> : null}
      </RowFixed>
    </MenuItem> */}
    </Modal>
  )
}
export default LPTokenSelecDialog
