import React from 'react'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { Heading, Text, Button, Flex, Card } from 'uikit'
import Column from 'components/Layout/Column'
import Chain from 'uikit/components/Svg/Icons/Chain'
import Pyramid from 'uikit/components/Svg/Icons/Pyramid'
import ArrowsUp from 'uikit/components/Svg/Icons/ArrowsUp'
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
        background='rgba(0,0,0,0)'
        index={2}
        hasCurvedDivider={false}
      >
        <Column style={{width: '56%', marginBottom: '171px'}}>
          <Heading textAlign="left" style={{fontSize: '79px'}}>
            Everything you know is about to change.
          </Heading> 
          <Flex mt="74px">
            <Button mr="12px" width="256px"> 
              <Text style={{color: "#101411", padding: '13px', fontSize: '18px', fontWeight: 500}}> 
                Enter App 
              </Text> 
            </Button>
            <Button width="256px" style={{background: "#101411", border: "2px solid #57E58E"}}> 
              <Text style={{color: "#57E58E", padding: '13px', fontSize: '18px', fontWeight: 500}}> 
                Start Trading 
              </Text> 
            </Button>
          </Flex>
        </Column>
        <MetricsSection />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background='rgba(0,0,0,0)'
        index={2}
        hasCurvedDivider={false}
      >
        <Card>
          <Column style={{padding: "70px", alignItems: "center"}}>
            <Heading textAlign="center" width="60%" style={{fontSize: '50px', paddingBottom: '50px'}}>
              Access a number of unique benefits.
            </Heading>
            <Card style={{background: "rgba(16, 20, 17, 0.6)", marginBottom: '10px'}}>
              <Flex style={{padding: "44px 10%", width: '100%', justifyContent: 'space-between'}}> 
                <Chain />
                <Column style={{maxWidth: '70%'}}>
                  <Heading pb="13px">
                    Multi-chain AMM
                  </Heading>
                  <Text>
                    The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click. Lorem ipsum dolor acviverra amet.
                  </Text>
                </Column>
              </Flex>
            </Card>
            <Card style={{background: "rgba(16, 20, 17, 0.6)", marginBottom: '10px'}}>
              <Flex style={{padding: "44px 10%", width: '100%', justifyContent: 'space-between'}}> 
                <Pyramid />
                <Column style={{maxWidth: '70%'}}>
                  <Heading pb="13px">
                    Multi-layer protocol
                  </Heading>
                  <Text>
                    The only platform you will not have to leave when executing your strategies for passive crypto income. Lorem amet acviverra.
                  </Text>
                </Column>
              </Flex>
            </Card>
            <Card style={{background: "rgba(16, 20, 17, 0.6)", marginBottom: '10px'}}>
              <Flex style={{padding: "44px 10%", width: '100%', justifyContent: 'space-between'}}> 
                <ArrowsUp />
                <Column style={{maxWidth: '70%'}}>
                  <Heading pb="13px">
                    Yield farming
                  </Heading>
                  <Text>
                    Earn passive income through staking and the bonds-as-a-service protocol. Lorem ipsum dolore sit amet acviverra volutpat micum.
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
