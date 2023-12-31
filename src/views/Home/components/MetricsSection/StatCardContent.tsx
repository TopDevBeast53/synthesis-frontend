import Column from 'components/Layout/Column'
import React from 'react'
import { Heading, Flex, Text, useMatchBreakpoints } from 'uikit'

const StatCardContent: React.FC<{ headingText: string; bodyText: string }> = ({ headingText, bodyText }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isMobile, isTablet } = useMatchBreakpoints()
  // const isSmallerScreen = isMobile || isTablet
  // const split = headingText.split(' ')
  // const lastWord = split.pop()
  // const remainingWords = split.slice(0, split.length).join(' ')

  return (
    <Flex
      minHeight={[null, null, null, '168px']}
      minWidth="232px"
      width="fit-content"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt={[null, null, null, null]}
    >
      <Column>
        <Text color="#101411" style={{ fontSize: '18px', fontWeight: '500', lineHeight: '136%', fontStyle: 'normal' }}>
          {bodyText}
        </Text>
        {/* {isSmallerScreen && remainingWords.length > 13 ? (
          <Heading color="#101411" fontSize={isMobile?"22px":"31px"} style={{ fontWeight: '500', lineHeight: '24.48px' }}>
            {remainingWords}
          </Heading>
        ) : (
          <Heading color="#101411" fontSize={isMobile?"22px":"31px"} style={{ fontWeight: '500', lineHeight: '24.48px' }}>
            {remainingWords}
          </Heading>
        )} */}
        <Heading color="#101411" mt="7px"  fontSize={isMobile?"22px":"31px"} style={{ lineHeight: '42.16px', fontStyle: 'normal', textAlign:"center" }}>
          {headingText}
        </Heading>
      </Column>
    </Flex>
  )
}

export default StatCardContent
