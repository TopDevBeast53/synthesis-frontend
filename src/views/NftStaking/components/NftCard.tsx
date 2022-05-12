import React, { useState, useCallback} from 'react'
import { Card, Flex, Image, Button, useModal, AutoRenewIcon } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NFTCardText, NFTCardTextType } from './NFTCardText'
import BridgeToSolanaModal from '../../NftBridge/components/BridgeToSolanaModal'

const NFTCard = styled(Card)`
  background-color: rgba(16, 20, 17, 0.9);
  border-style: solid;
  border-width: 1px;
  border-color: rgb(30, 30, 30);
  :hover {
    background-color: rgba(16, 20, 17, 0.4);
    border-color: rgba(255, 255, 255);
    cursor: pointer;
  }     
  ${props=>
    props.selected ? 
    "box-shadow: 0px 0px 2px 4px white;"
    :
    ""
  }
`

const NFTCardInfoPanel = styled.div`
  border-radius: 0.75rem;
  padding: 20px 29px 23px 29px;
`

const NFTImageInfoPanel = styled(Card)`
  border-radius: 0.75rem;
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
        return 'background: #FF11EE';
      default: 
        return 'background: white';
    }
  }}
`

const NFTInfoSeparator = styled.div`
  margin: 7px 0;
  height: 1px;
  opacity: 0.5;
`

interface NFTInfo {
  type: string,
  caption: string,
  value: React.ReactNode,
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
  loading?: boolean
  onhandleChangeCheckBox?: (tokenId: string, isChecked: boolean) => void
  showBridgeToSolanaModal?: boolean
}

const NFTImage = styled(Image)`
  background-color: black;
`

const NftCard: React.FC<NftCardProps> = ({
  name,
  infos,
  actions,
  bgSrc,
  tokenId,
  disabled,
  loading,
  onhandleChangeCheckBox,
  showBridgeToSolanaModal,
}) => {
  const { t } = useTranslation()
  const [isSelected, setSelected] = useState(false)

  const [isRememberChecked, setIsRememberChecked] = useState(false)

  const handleCardSelect = useCallback(() => {
    if (onhandleChangeCheckBox != null) {
      onhandleChangeCheckBox(tokenId, !isRememberChecked)
    }
    setIsRememberChecked(!isRememberChecked)
    setSelected(!isSelected)    
  }, 
    [onhandleChangeCheckBox, tokenId, isRememberChecked, setIsRememberChecked, isSelected]
  );

  const [onPresentBridgeModal] = useModal(
    <BridgeToSolanaModal tokenIDToBridge={tokenId} />
  );

  const handleClick = (e, action, params) => {
    e.stopPropagation()
    action(...params)
  }
  
  return (
    <div role = "button" tabIndex={0} onClick={handleCardSelect} onKeyDown={handleCardSelect} >
      <NFTCard m="10px" selected={isSelected}>
        <NFTImageInfoPanel>
          <NFTImage src={bgSrc} width={316} height={253}/>
        </NFTImageInfoPanel>
        <NFTCardInfoPanel>
          <Flex flexDirection="column">
            { 
              infos.map(({type, caption, value}, index) => (
                <div key={caption}>
                  {index !== 0 && <NFTInfoSeparator /> }
                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex alignItems="center">
                      <NFTInfoMarker marker={NFTInfoMarkerType[type]} />
                      <NFTCardText type={NFTCardTextType.cardCaption} style={{marginLeft: '0.5rem', marginRight: '0.5rem'}}>
                        {caption}
                      </NFTCardText>
                    </Flex>
                    <NFTCardText type={NFTCardTextType.cardValue}>
                      {value}
                    </NFTCardText>
                  </Flex>
                </div>
              ))
            }
          </Flex>
        </NFTCardInfoPanel>

        <Flex position="relative" padding="0px 14px" flexDirection="column">
          {
            actions.filter(({displayed}) => displayed).map(({caption, action, id, params}) => (
              <Button 
                key={id} isLoading={loading} 
                endIcon={loading ? <AutoRenewIcon spin color="currentColor" /> : null}  
                onClick={e => handleClick(e, action, params)} 
                disabled={disabled} 
                style={{ marginBottom: '8px' }}>
                {caption}
              </Button>  
            ))
          }
          {
            showBridgeToSolanaModal &&
            <Button onClick={onPresentBridgeModal} style={{ marginBottom: '8px' }}>
              {t('Bridge To Solana')}
            </Button>
          }
        </Flex>
      </NFTCard>
    </div>
  )
}

export default NftCard
