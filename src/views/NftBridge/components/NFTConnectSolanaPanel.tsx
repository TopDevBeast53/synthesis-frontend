import React from 'react'

import styled from 'styled-components'
import { Card, Flex, Text } from 'uikit'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const NFTStartCollectCard = styled(Card)`
    padding: 58px 68px 55px 122px;
`;

const NFTStartCollectText = styled(Text)`
    weight: 400;
    font-size: 70px;
    line-height: 74px;
    color: #F9FAFA;
`

const StartCollectImageBackground = styled.div`  
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    background: url('/images/nfts/NFTBackground.png');
    height: 485px;
    width: 545px;
    
    border-radius: 12px;
    position: relative;
`

const NFTStartCollectFlex = styled(Flex)`
    justify-content: space-between;
    align-items: center;

    @media (max-width: 1400px) {
        justify-content: center;
        flex-direction: column;
    }
`

const NFTConnectSolanaPanel: React.FC = () => {
    return (
        <NFTStartCollectCard> 
            <NFTStartCollectFlex> 
                <Flex flexDirection="column" style={{marginBottom: "20px"}}>
                    <NFTStartCollectText> 
                        Connect
                    </NFTStartCollectText>
                    <NFTStartCollectText> 
                        Solana Wallet
                    </NFTStartCollectText>
                </Flex>

                <NFTStartCollectFlex style={{borderRadius: "12px"}}>
                    <StartCollectImageBackground>
                        <Flex justifyContent="center" alignItems="center" style={{height: "100%"}}> 
                            <WalletMultiButton />
                        </Flex>
                    </StartCollectImageBackground>
                </NFTStartCollectFlex>
            </NFTStartCollectFlex>
        </NFTStartCollectCard>
        );
};

export default NFTConnectSolanaPanel;