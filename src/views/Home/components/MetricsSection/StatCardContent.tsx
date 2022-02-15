import Column from 'components/Layout/Column'
import React from 'react'
import { Heading, Flex, Text, useMatchBreakpoints } from 'uikit'

const StatCardContent: React.FC<{ headingText: string; bodyText: string; }> = ({
  headingText,
  bodyText,
}) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallerScreen = isMobile || isTablet
  const split = headingText.split(' ')
  const lastWord = split.pop()
  const remainingWords = split.slice(0, split.length).join(' ')

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
        <Text color="#101411" style={{fontSize: "18px", fontWeight: '500', lineHeight: '136%', fontStyle: 'normal'}}>{bodyText}</Text>
        {isSmallerScreen && remainingWords.length > 13 ? (
          <Heading color="#101411" fontSize="31px" style={{fontWeight: '500', lineHeight: '24.48px'}}>{remainingWords}</Heading>
        ) : (
          <Heading color="#101411" fontSize="31px" style={{fontWeight: '500', lineHeight: '24.48px'}}>{remainingWords}</Heading>
        )}
        <Heading color="#101411" mt="7px" style={{fontSize: "31px", lineHeight: '42.16px',  fontStyle: 'normal'}}>
          {lastWord}
        </Heading>
      </Column>
    </Flex>
  )
}

export default StatCardContent
