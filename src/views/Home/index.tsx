import React from 'react'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { swapSectionData, earnSectionData } from './components/SalesSection/data'
import MetricsSection from './components/MetricsSection'
import SalesSection from './components/SalesSection'
import FarmsPoolsRow from './components/FarmsPoolsRow'
import Footer from './components/Footer'
import CakeDataRow from './components/CakeDataRow'

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
        <MetricsSection />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background='rgba(0,0,0,0)'
        index={2}
        hasCurvedDivider={false}
      >
        {/* <OuterWedgeWrapper>
          <InnerWedgeWrapper top fill={theme.isDark ? '#201335' : '#D8CBED'}>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper> */}
        <SalesSection {...swapSectionData} />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background='rgba(0,0,0,0)'
        index={2}
        hasCurvedDivider={false}
      >
        {/* <OuterWedgeWrapper>
          <InnerWedgeWrapper width="150%" top fill={theme.colors.background}>
            <WedgeTopRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper> */}
        <SalesSection {...earnSectionData} />
        <FarmsPoolsRow />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background='rgba(0,0,0,0)'
        index={2}
        hasCurvedDivider={false}
      >
        {/* <WinSection /> */}
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background='rgba(0,0,0,0)'
        index={2}
        hasCurvedDivider={false}
      >
        {/* <SalesSection {...cakeSectionData} /> */}
        <CakeDataRow />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background='rgba(0,0,0,0)'
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </PageSection>
    </>
  )
}

export default Home
