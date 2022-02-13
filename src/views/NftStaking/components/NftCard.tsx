import { Card, CardBody, Flex, Heading, Image, Text, Button, Checkbox } from 'uikit'
import React, {useState, useCallback} from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

interface NftCardProps {
  bgSrc: string
  tokenId: string
  isStaked: boolean
  level: number
  tokenOwner: string
  uri?: string
  disabled?: boolean
  onhandleChangeCheckBox: (tokenId: string, isChecked: boolean) => void
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
  tokenOwner,
  uri,
  disabled,
  onhandleChangeCheckBox,
}) => {
  const [isRememberChecked, setIsRememberChecked] = useState(false)

  const handleChangeCheckBox = () => {
    onhandleChangeCheckBox(tokenId, !isRememberChecked)
    setIsRememberChecked(!isRememberChecked)
  }

  const renderBody = () => (
    <CardBody p="8px">
      <StyledImage src={bgSrc} height={125} width={375} />
      <Flex
        position="relative"
        height="170px"
        justifyContent="center"
        alignItems="flex-end"
        py="8px"
        flexDirection="column"
      >
        <Heading color={disabled ? 'textDisabled' : 'body'} as="h3" mb="8px">
          TokenId: {tokenId}
        </Heading>
        <Text fontSize="12px" color="secondary" bold mb="8px" ml="4px">
          Level: {level}
        </Text>
        <Text fontSize="10px" color="primary" textTransform="lowercase" bold mb="8px" ml="4px">
          Owner: {tokenOwner}
        </Text>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
          {isStaked? 'staked' : ''}
        </Text>
        <Checkbox
          name="confirmed"
          type="checkbox"
          checked={isRememberChecked}
          onChange={handleChangeCheckBox}
          scale="sm"
        />
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
