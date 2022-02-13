import React from 'react';

import { Flex, Text, Heading} from 'uikit'

import styled from 'styled-components'

interface Props {
    title: string
    subtitle: string
}
  
const MigrationHeaderContainer = styled(Flex)`
    align-items: center;
    padding: 24px;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const Header: React.FC<Props> = ({ title, subtitle }) => {
    return (
        <MigrationHeaderContainer>
            <Flex width="100%" alignItems="flex-start" justifyContent="space-between" flexDirection="column">
                <Flex flexDirection="column" alignItems="center" alignSelf="center">
                    <Heading as="h2" mb="8px">
                        {title}
                    </Heading>
                    <Flex alignItems="center">
                        <Text color="textSubtle" fontSize="14px">
                        {subtitle}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </MigrationHeaderContainer>
    );
};

export default Header;