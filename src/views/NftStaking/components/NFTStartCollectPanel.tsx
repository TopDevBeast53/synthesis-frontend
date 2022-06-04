import React from 'react'

import styled from 'styled-components'
import { Card, Flex, Text, Button } from 'uikit'

const NFTStartCollectCard = styled(Card)`
  padding: 25px 25px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 58px 68px 55px 122px;    
  }
`
const NFTStartCollectText = styled(Text)`
  weight: 400;
  font-size: 70px;
  line-height: 74px;
  color: #f9fafa;
  // margin-right: 85px;
`

const StartCollectImageBackground = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background: url('/images/nfts/NFTBackground.png');
  // height: 485px;
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

const COLLECT_NFT_LINK = 'https://magiceden.io/marketplace/geo_gang'

const NFTStartCollectPanel: React.FC = () => {
  return (
    <NFTStartCollectCard>
      <NFTStartCollectFlex>
        {/* <Flex flexDirection="column" style={{ marginBottom: '20px' }}>
          <NFTStartCollectText>Start</NFTStartCollectText>
          <NFTStartCollectText>to collect!</NFTStartCollectText>
        </Flex> */}

        <NFTStartCollectFlex style={{ borderRadius: '12px' }}>
          <StartCollectImageBackground>
            <Flex justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
              <Button onClick={() => window.open(COLLECT_NFT_LINK, '_blank')}>Buy Geobots</Button>
            </Flex>
          </StartCollectImageBackground>
        </NFTStartCollectFlex>
      </NFTStartCollectFlex>
    </NFTStartCollectCard>
  )
}

export default NFTStartCollectPanel
