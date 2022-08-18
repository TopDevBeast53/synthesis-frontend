import React from 'react'
import { baseColors, darkColors } from '../../theme/colors'
import { Flex, Box } from '../Box'
import { Link } from '../Link'
import { StyledFooter, StyledList, StyledListItem, StyledText } from './styles'
import SocialLinks from './Components/SocialLinks'
import { FooterProps } from './types'
import { HelixByGeometryBlue } from '../Svg'
import CakePrice from '../CakePrice/CakePrice'
import { Colors } from '../..'
import PoweredByAlchemy from './PoweredByAlchemy'

const MenuItem: React.FC<FooterProps> = ({ items, isDark, cakePriceUsd, ...props }) => {
  return (
    <StyledFooter
      p={['10px 50px 40px 40px', null, '36px 40px 96px 40px']}
      {...props}
      flexDirection="column"
      alignItems="center"
    >
      <PoweredByAlchemy />
      <Flex flexDirection="column" width={['100%', null, '100%']} pt={['30px', null, '60px']}>
        <Box display={['block', null, 'none']} mb="24px">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex flex={1}>
              <HelixByGeometryBlue isDark={isDark} width="130px" />
            </Flex>
            <Flex flex={1} justifyContent="center">
              <CakePrice cakePriceUsd={cakePriceUsd} color={darkColors.textSubtle as keyof Colors} />
            </Flex>
          </Flex>
        </Box>
        <Flex
          order={[2, null, 1]}
          flexDirection={['row', null, 'row']}
          flexWrap={['wrap', null, null]}
          justifyContent="space-between"
          alignItems="flex-start"
          mb={[null, null, null]}
        >
          <Box display={['none', null, 'block']} style={{ alignSelf: 'center', flex: '1.5' }}>
            <Flex flexDirection="column" alignItems="center">
              <HelixByGeometryBlue isDark width="140px" />
              <Box mt="20px">
                <CakePrice cakePriceUsd={cakePriceUsd} color={darkColors.textSubtle as keyof Colors} />
              </Box>
            </Flex>
          </Box>
          {items?.map((item, index) => (
            <StyledList key={item.label}>
              <StyledListItem>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      color={isHighlighted ? baseColors.warning : darkColors.text}
                      bold={false}
                    >
                      {label}
                    </Link>
                  ) : (
                    <StyledText>{label}</StyledText>
                  )}
                </StyledListItem>
              ))}
              {index + 1 === items.length && <SocialLinks mt="15px" />}
            </StyledList>
          ))}
        </Flex>
      </Flex>
    </StyledFooter>
  )
}

export default MenuItem
