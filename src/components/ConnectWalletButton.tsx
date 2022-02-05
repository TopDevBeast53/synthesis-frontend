import React from 'react'
import { Button, useWalletModal } from 'uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import WalletIcon from 'uikit/components/Svg/Icons/Wallet'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      <WalletIcon />
      {t('Connect Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
