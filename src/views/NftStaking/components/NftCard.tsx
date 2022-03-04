import { Card, Flex, Image, Text, Checkbox, Button } from 'uikit'

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

import NFTAuraIcon from './NFTAuraIcon'
import { NFTCardText, NFTCardTextType } from './NFTCardText'

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
  remainNextLevel
}

const NFTInfoMarker = styled.div<{marker: NFTInfoMarkerType}>`
  width: 14px;
  height: 14px;
  border-radius: 7px;

  ${({marker}) => {
    switch (marker) {
      case NFTInfoMarkerType.level:
        return 'background: #FF6A50';
      case NFTInfoMarkerType.points:
        return 'background: #ABBEFF';
      case NFTInfoMarkerType.remainNextLevel:
        return 'background: #ABBEFF';
      default: 
        return 'background: white';
    }
  }}
`

const NFTInfoSeparator = styled.div`
  margin: 7px 0;
  height: 1px;
  opacity: 0.5;
  background: rgba(249, 250, 250, 0.5);
`

interface NftCardProps {
  bgSrc: string
  tokenId: string
  isStaked: boolean
  isApproved?: boolean
  level: number
  auraPoints: number
  remainAPToNextLevel: number
  enableBoost?: boolean
  disabled?: boolean
  onhandleChangeCheckBox?: (tokenId: string, isChecked: boolean) => void
  onhandleBoost?: (tokenId: string) => void

  enableBridgeApprove?: boolean
  enableBridgeMutation?: boolean
  onHandleBridgeApprove?: (tokenId: string) => void
  onHandleBridgeMutation?: (tokenId: string) => void

}

const NFTImage = styled(Image)`
  border-radius: 5px;
  background-color: black;
`

const NftCard: React.FC<NftCardProps> = ({
  bgSrc,
  tokenId,
  isStaked,
  isApproved,
  level,
  auraPoints,
  remainAPToNextLevel,
  enableBoost = false,
  enableBridgeApprove = false,
  enableBridgeMutation = false,
  disabled,
  onhandleChangeCheckBox,
  onhandleBoost,
  onHandleBridgeApprove,
  onHandleBridgeMutation,
}) => {
  const [isRememberChecked, setIsRememberChecked] = useState(false)

  const handleChangeCheckBox = useCallback(() => {
    if (onhandleChangeCheckBox != null) {
      onhandleChangeCheckBox(tokenId, !isRememberChecked)
    }
    setIsRememberChecked(!isRememberChecked)
  }, 
    [onhandleChangeCheckBox, tokenId, isRememberChecked,setIsRememberChecked]
  );

  const handleBoost = () => {
    if (onhandleBoost != null) {
      onhandleBoost(tokenId)
    }
  }

  const handleBridgeApprove = () => {
    if (onHandleBridgeApprove != null) {
      onHandleBridgeApprove(tokenId)
    }
  }

  const handleBridgeMutation = () => {
    if (onHandleBridgeMutation != null) {
      onHandleBridgeMutation(tokenId)
    }
  }

  return (
    <NFTCard m="19px">
      <NFTImage src={bgSrc} width={366} height={326}/>

      <Flex 
        justifyContent="space-between" 
        alignItems="center"
        style={{marginTop: '42px', marginBottom: '28px'}}
      >
        <NFTAuraIcon />
        <NFTNameText>
          Pink Rose {' '}
          {
            onhandleChangeCheckBox && 
            <Checkbox
              name="confirmed"
              type="checkbox"
              checked={isRememberChecked}
              onChange={handleChangeCheckBox}
              scale="sm"
              disabled={disabled}
            />
          }
        </NFTNameText>
      </Flex>

      <NFTCardInfoPanel style={{marginBottom: '25px'}}>
        <Flex flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <NFTInfoMarker marker={NFTInfoMarkerType.level} />
              <NFTCardText type={NFTCardTextType.cardCaption} style={{marginLeft: '14px'}}>
                Level
              </NFTCardText>
            </Flex>
            <NFTCardText type={NFTCardTextType.cardValue}>
              {level}
            </NFTCardText>
          </Flex>
          <NFTInfoSeparator />
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <NFTInfoMarker marker={NFTInfoMarkerType.points} />
              <NFTCardText type={NFTCardTextType.cardCaption} style={{marginLeft: '14px'}}>
              AuraPoints
              </NFTCardText>
            </Flex>
            <NFTCardText type={NFTCardTextType.cardValue}>
              {auraPoints}
            </NFTCardText>
          </Flex>
          <NFTInfoSeparator />
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <NFTInfoMarker marker={NFTInfoMarkerType.remainNextLevel} />
              <NFTCardText type={NFTCardTextType.cardCaption} style={{marginLeft: '14px'}}>
                Remain APTo Next Level
              </NFTCardText>
            </Flex>
            <NFTCardText type={NFTCardTextType.cardValue}>
              {remainAPToNextLevel}
            </NFTCardText>
          </Flex>
        </Flex>
      </NFTCardInfoPanel>

      <Flex position="relative" padding="0px 14px" flexDirection="column">
        { 
          onhandleBoost && 
          <Button onClick={handleBoost} disabled={!enableBoost || disabled} style={{ marginBottom: '8px' }}>
            Boost
          </Button>
        }
        {
          enableBridgeApprove && onHandleBridgeApprove && 
          <Button onClick={handleBridgeApprove} disabled={!enableBridgeApprove || disabled} style={{ marginBottom: '8px' }}>
            Approve
          </Button>
        }
        {
          onHandleBridgeMutation && 
          <Button onClick={handleBridgeMutation} disabled={!enableBridgeMutation || disabled} style={{ marginBottom: '8px' }}>
            Bridge to Solana
          </Button>
        }
      </Flex>
    </NFTCard>
  )
}

export default NftCard
