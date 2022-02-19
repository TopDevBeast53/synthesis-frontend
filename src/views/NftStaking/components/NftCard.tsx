import { Card, CardBody, Flex, Heading, Image, Text, Checkbox, Button } from 'uikit'
import React, {useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

interface NftCardProps {
  bgSrc: string
  tokenId: string
  isStaked: boolean
  level: number
  auraPoints: number
  remainAPToNextLevel: number
  enableBoost: boolean
  uri?: string
  disabled?: boolean
  onhandleChangeCheckBox: (tokenId: string, isChecked: boolean) => void
  onhandleBoost: (tokenId: string) => void
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

const NftCard: React.FC<NftCardProps> = ({
  bgSrc,
  tokenId,
  isStaked,
  level,
  auraPoints,
  remainAPToNextLevel,
  enableBoost,
  uri,
  disabled,
  onhandleChangeCheckBox,
  onhandleBoost,
}) => {
  const [isRememberChecked, setIsRememberChecked] = useState(false)

  const handleChangeCheckBox = () => {
    onhandleChangeCheckBox(tokenId, !isRememberChecked)
    setIsRememberChecked(!isRememberChecked)
  }

  const handleBoost = () => {
    onhandleBoost(tokenId)
  }

  const renderBody = () => (
    <CardBody p="8px">
      <StyledImage src={bgSrc} height={220} width={375} />
      <Flex
        position="relative"
        height="175px"
        justifyContent="center"
        alignItems="flex-end"
        py="8px"
        flexDirection="column"
      >
        <Heading color="primary" as="h3" mb="8px">
          {isStaked? 'staked' : ''}
        </Heading>
        <Text fontSize="12px" color="secondary" bold mb="8px" ml="4px">
          Level: {level}
        </Text>
        <Text fontSize="12px" color="secondary" bold mb="8px" ml="4px">
          AuraPoints: {auraPoints}
        </Text>
        <Text fontSize="12px" color="secondary" bold mb="8px" ml="4px" paddingBottom="10px">
          remainAPToNextLevel: {remainAPToNextLevel}
        </Text>
        <Checkbox
          name="confirmed"
          type="checkbox"
          checked={isRememberChecked}
          onChange={handleChangeCheckBox}
          scale="sm"
          disabled={disabled}
        />
      </Flex>
      <Flex position="relative" padding="0px 14px" flexDirection="column">
        <Button onClick={handleBoost} disabled={!enableBoost || disabled} style={{ marginBottom: '8px' }}>
            Boost
        </Button>
      </Flex>
    </CardBody>
  )

  return (
    <StyledHotCollectionCard disabled={disabled}>
      {uri ? <Link to={uri}>{renderBody()}</Link> : <div style={{ cursor: 'default' }}>{renderBody()}</div>}
    </StyledHotCollectionCard>
  )
}

export default NftCard
