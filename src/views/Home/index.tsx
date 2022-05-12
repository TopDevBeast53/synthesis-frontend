import React from 'react'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { Heading, Text, Button, Flex, Card } from 'uikit'
import Column from 'components/Layout/Column'
import Chain from 'uikit/components/Svg/Icons/Chain'
import ArrowsUp from 'uikit/components/Svg/Icons/ArrowsUp'
import SyncAlt from 'uikit/components/Svg/Icons/SyncAlt'
import MetricsSection from './components/MetricsSection'

const Home: React.FC = () => {
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <PageMeta />
      {/* <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background='rgba(0,0,0,0)'
        index={2}
        hasCurvedDivider={false}
      > */}
      {/* {account && (
          <UserBannerWrapper>
            <UserBanner />
          </UserBannerWrapper>
        )} */}
      {/* <HomeBanner account={account} /> */}
      {/* <Hero /> */}
      {/* </StyledHeroSection> */}
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background="rgba(0,0,0,0)"
        index={2}
        hasCurvedDivider={false}
      >
        <Column style={{ width: '56%', marginBottom: '171px' , marginLeft:"auto", marginRight:"auto"}}>
          <Heading textAlign="left" style={{ fontSize: '68px' }}>
            Easily Swap ERC20 Cryptoassets, LP Tokens & Yield.
          </Heading>
          <Flex mt="74px">
            <Button mr="12px" width="256px">
              <Text style={{ color: '#101411', padding: '13px', fontSize: '18px', fontWeight: 500 }}>Trade Crypto</Text>
            </Button>
            <Button mr="12px" width="300px" style={{ background: '#101411', border: '2px solid #ABBDFF' }}>
              <Text style={{ color: '#ABBDFF', padding: '13px', fontSize: '18px', fontWeight: 500 }}>
                Trade LP Tokens
              </Text>
            </Button>
            <Button width="256px" style={{ background: '#ABBDFF' }}>
              <Text style={{ color: '#101411', padding: '13px', fontSize: '18px', fontWeight: 500 }}>Trade Yield</Text>
            </Button>
          </Flex>
        </Column>
        <MetricsSection />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="rgba(0,0,0,0)"
        index={2}
        hasCurvedDivider={false}
      >
        <Card>
          <Column style={{ padding: '70px', alignItems: 'center' }}>
            <Heading textAlign="center" width="60%" style={{ fontSize: '50px', paddingBottom: '50px' }}>
              Helix provides a wide range of new opportunities
            </Heading>
            <Card style={{ background: 'rgba(16, 20, 17, 0.6)', marginBottom: '10px' }}>
              <Flex style={{ padding: '44px 10%', width: '100%', justifyContent: 'space-between' }}>
                <Chain />
                <Column style={{ maxWidth: '70%' }}>
                  <Heading pb="13px">Instantly Swap Yield Positions at Low Cost</Heading>
                  <Text>
                    Switch yield positions from one DeFi platform to another in a single action - cutting costs relating
                    to gas fees, as well as time spent moving funds.
                  </Text>
                </Column>
              </Flex>
            </Card>
            <Card style={{ background: 'rgba(16, 20, 17, 0.6)', marginBottom: '10px' }}>
              <Flex style={{ padding: '44px 10%', width: '100%', justifyContent: 'space-between' }}>
                <Chain />
                <Column style={{ maxWidth: '70%' }}>
                  <Heading pb="13px">Easily De-Risk By Locking in Fixed Returns</Heading>
                  <Text>
                    Create yield-generating positions and lock in guaranteed fixed returns using Yield Swaps, allowing
                    for safer strategies to be implemented.
                  </Text>
                </Column>
              </Flex>
            </Card>
            <Card style={{ background: 'rgba(16, 20, 17, 0.6)', marginBottom: '10px' }}>
              <Flex style={{ padding: '44px 10%', width: '100%', justifyContent: 'space-between' }}>
                <ArrowsUp />
                <Column style={{ maxWidth: '70%' }}>
                  <Heading pb="13px">Enter New Yield Positions at Discount Rates</Heading>
                  <Text>
                    Access unique opportunities to buy yield-bearing LP tokens and yield itself at lower-than-predicted
                    rates, opening up totally new revenue streams.
                  </Text>
                </Column>
              </Flex>
            </Card>
          </Column>
        </Card>
      </PageSection>
    </>
  )
}

export default Home
