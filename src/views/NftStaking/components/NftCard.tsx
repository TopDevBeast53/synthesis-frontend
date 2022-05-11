import { Card, Flex, Image, Text, Checkbox, Button, useModal } from 'uikit'

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import NFTIcon from './NFTIcon'
import { NFTCardText, NFTCardTextType } from './NFTCardText'
import BridgeToSolanaModal from '../../NftBridge/components/BridgeToSolanaModal'

const NFTCard = styled(Card)`
  width: 422px;
  height: 730px;
  padding: 20px 28px 39px 28px;
`

const NFTNameText = styled(Text)`
  font-size: 30px;
  color: rgba(249,250,250, 1)
  line-height: 30px;
  weight: 400;
`

const NFTCardInfoPanel = styled(Card)`
  background-color: rgba(16, 20, 17, 0.7);
  border-radius: 10px;
  padding: 20px 29px 23px 29px;
`

enum NFTInfoMarkerType {
  level,
  points,
  remainNextLevel,
}

const NFTInfoMarker = styled.div<{ marker: NFTInfoMarkerType }>`
  width: 14px;
  height: 14px;
  border-radius: 7px;

  ${({ marker }) => {
    switch (marker) {
      case NFTInfoMarkerType.level:
        return 'background: #FF6A50'
      case NFTInfoMarkerType.points:
        return 'background: #ABBEFF'
      case NFTInfoMarkerType.remainNextLevel:
        return 'background: #ABBEFF'
      default:
        return 'background: white'
    }
  }}
`

const NFTInfoSeparator = styled.div`
  margin: 7px 0;
  height: 1px;
  opacity: 0.5;
  background: rgba(249, 250, 250, 0.5);
`

interface NFTInfo {
  caption: string
  value: React.ReactNode
}

interface NFTAction {
  id: string
  caption: string
  action: (...value: any[]) => void
  displayed: boolean
  params: any[]
}

interface NftCardProps {
  name?: string | undefined
  infos: NFTInfo[]
  actions: NFTAction[]
  bgSrc: string
  tokenId: string
  disabled?: boolean
  onhandleChangeCheckBox?: (tokenId: string, isChecked: boolean) => void
  showBridgeToSolanaModal?: boolean
}

const NFTImage = styled(Image)`
  border-radius: 5px;
  margin-top: 6px;
  background-color: black;
`

const NftCard: React.FC<NftCardProps> = ({
  name,
  infos,
  actions,
  bgSrc,
  tokenId,
  disabled,
  onhandleChangeCheckBox,
  showBridgeToSolanaModal,
}) => {
  const { t } = useTranslation()

  const [isRememberChecked, setIsRememberChecked] = useState(false)

  const handleChangeCheckBox = useCallback(() => {
    if (onhandleChangeCheckBox != null) {
      onhandleChangeCheckBox(tokenId, !isRememberChecked)
    }
    setIsRememberChecked(!isRememberChecked)
  }, [onhandleChangeCheckBox, tokenId, isRememberChecked, setIsRememberChecked])

  const [onPresentBridgeModal] = useModal(<BridgeToSolanaModal tokenIDToBridge={tokenId} />)

  return (
    <NFTCard m="19px">
      <NFTImage src={bgSrc} width={366} height={313} />

      <Flex justifyContent="space-between" alignItems="center" style={{ marginTop: '42px', marginBottom: '28px' }}>
        <NFTIcon />
        <NFTNameText>
          {name ?? 'Pink Rose'}{' '}
          {onhandleChangeCheckBox && (
            <Checkbox
              name="confirmed"
              type="checkbox"
              checked={isRememberChecked}
              onChange={handleChangeCheckBox}
              scale="sm"
              disabled={disabled}
            />
          )}
        </NFTNameText>
      </Flex>

      <NFTCardInfoPanel style={{ marginBottom: '25px' }}>
        <Flex flexDirection="column">
          {infos.map(({ caption, value }, index) => (
            <div key={caption}>
              {index !== 0 && <NFTInfoSeparator />}
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <NFTInfoMarker marker={NFTInfoMarkerType.level} />
                  <NFTCardText type={NFTCardTextType.cardCaption} style={{ marginLeft: '14px' }}>
                    {caption}
                  </NFTCardText>
                </Flex>
                <NFTCardText type={NFTCardTextType.cardValue}>{value}</NFTCardText>
              </Flex>
            </div>
          ))}
        </Flex>
      </NFTCardInfoPanel>

      <Flex position="relative" padding="0px 14px" flexDirection="column">
        {actions
          .filter(({ displayed }) => displayed)
          .map(({ caption, action, id, params }) => (
            <Button key={id} onClick={() => action(...params)} disabled={disabled} style={{ marginBottom: '8px' }}>
              {caption}
            </Button>
          ))}
        {showBridgeToSolanaModal && (
          <Button onClick={onPresentBridgeModal} style={{ marginBottom: '8px' }}>
            {t('Bridge To Solana')}
          </Button>
        )}
      </Flex>
    </NFTCard>
  )
}

export default NftCard
