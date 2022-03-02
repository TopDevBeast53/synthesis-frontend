import { Card, CardBody, Flex, Image, Text, Button } from 'uikit'

import React from 'react'
import styled, { css } from 'styled-components'

interface NftCardProps {
  bgSrc: string
  tokenId: string
  level: number
  enableApproveBtn: boolean
  enableBridgeBtn: boolean
  onhandleApprove: (tokenId: string) => void
  onhandleBridge: (tokenId: string) => void
}

const StyledHotCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 8px;
  border-bottom-left-radius: 26px;
  transition: opacity 200ms;

  & > div {
    border-radius: 8px;
    border-bottom-left-radius: 26px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ disabled }) =>
      disabled
        ? ''
        : css`
            &:hover {
              cursor: pointer;
              opacity: 0.6;
            }
          `}
  }
`

const StyledImage = styled(Image)`
  img {
    border-radius: 4px;
  }
`
const NftBridgeToSolanaCard: React.FC<NftCardProps> = ({
  bgSrc,
  tokenId,
  level,
  enableApproveBtn,
  enableBridgeBtn,
  onhandleApprove,
  onhandleBridge,
}) => {

  const handleApprove = () => {
    onhandleApprove(tokenId)
  }

  const handleBridge = () => {
    onhandleBridge(tokenId)
  }

  const renderBody = () => (
    <CardBody p="8px">
      <StyledImage src={bgSrc} height={220} width={375} />
      <Text fontSize="12px" color="secondary" bold mb="8px" ml="4px">
        Level: {level}
      </Text>
      <Flex position="relative" padding="0px 14px" flexDirection="column">
        <Button onClick={handleApprove} disabled={!enableApproveBtn} style={{ marginBottom: '6px' }}>
          {enableApproveBtn? "Approve":"Approved"}
        </Button>
        <Button onClick={handleBridge} disabled={!enableBridgeBtn} style={{ marginBottom: '8px' }}>
          BridgeToSolana
        </Button>
      </Flex>
    </CardBody>
  )

  return (
    <StyledHotCollectionCard disabled={false}>
      {renderBody()}
    </StyledHotCollectionCard>
  )
}

export default NftBridgeToSolanaCard
