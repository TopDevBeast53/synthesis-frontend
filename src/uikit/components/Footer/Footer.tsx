import React from 'react'
import { baseColors, darkColors } from '../../theme/colors'
import { Flex, Box } from '../Box'
import { Link } from '../Link'
import { StyledFooter, StyledIconMobileContainer, StyledList, StyledListItem, StyledText } from './styles'
import SocialLinks from './Components/SocialLinks'
import { FooterProps } from './types'
import { HelixByGeometryBlue } from '../Svg'

const MenuItem: React.FC<FooterProps> = ({
  items,
  isDark,
  // toggleTheme,
  // currentLang,
  // langs,
  // setLang,
  // cakePriceUsd,
  // buyCakeLabel,
  ...props
}) => {
  return (
    <StyledFooter p={['40px 16px', null, '56px 40px 32px 40px']} {...props} justifyContent="center">
      <Flex flexDirection="column" width={['100%', null, '1200px;']}>
        <StyledIconMobileContainer display={['block', null, 'none']}>
          <HelixByGeometryBlue isDark={isDark} width="130px" />
        </StyledIconMobileContainer>
        <Flex
          order={[2, null, 1]}
          flexDirection={['column', null, 'row']}
          justifyContent="space-between"
          alignItems="flex-start"
          mb={['42px', null, '24px']}
        >
          <Box display={['none', null, 'block']} style={{alignSelf:"center"}}>
            <HelixByGeometryBlue isDark width="140px" />
          </Box>
          {items?.map((item, index) => (
            <StyledList key={item.label}>
              <StyledListItem style={{paddingBottom:"15px"}}>{item.label}</StyledListItem>
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
              {(index+1 === items.length)&&<SocialLinks order={[2]} pb={['42px', null, '32px']} mb={['0', null, '32px']} />}
            </StyledList>
          ))}          
        </Flex>
        {/* <SocialLinks order={[2]} pb={['42px', null, '32px']} mb={['0', null, '32px']} /> */}
      </Flex>
    </StyledFooter>
  )
}

export default MenuItem
