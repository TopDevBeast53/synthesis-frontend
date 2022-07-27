import React, { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
// import { SUPPORTED_NETWORKS } from 'config/constants/networks'
import { SupportedChainId } from 'config/constants/chains'
import { usePopper } from 'react-popper'
import { Flex, Image } from 'uikit'
import styled from 'styled-components/macro'

const ActiveRowWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  width: 100%;
`
const FlyoutHeader = styled(Flex)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-weight: 400;
  padding-bottom: 8px;
`
const FlyoutMenu = styled(Flex)`
  background-color: #101411;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 12px;
  width: 280px;
  padding-bottom: 4px;
  padding-top: 4px;
  pointer-events: auto;
  z-index: 1001;
`
const FlyoutMenuContents = styled(Flex)`
  align-items: flex-start;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px;
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
  width: 100%;
`
const FlyoutRow = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${({ active, theme }) => (active ? theme.colors.background : 'transparent')};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  width: 100%;
`
const FlyoutRowActiveIndicator = styled.div`
  background-color: #5BB318;
  border-radius: 50%;
  height: 9px;
  width: 9px;
`

const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
`

const NetworkLabel = styled.div`
  flex: 1 1 auto;
  padding-left: 10px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const SelectorControls = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.tertiary};
  height: 32px;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  padding-left: 40px;
  margin-right: 8px;
  position: relative;
`

const NetworkIcon = styled(Image)`
  left: 0;
  position: absolute;
  top: -4px;
  z-index: 102;

  & > img {
    border-radius: 50%;
  }
`

const SubNetworkIcon = styled(Image)`
  z-index: 102;

  & > img {
    border-radius: 50%;
  }
`

const SUPPORTED_NETWORKS: Record<
  number,
  {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
    logoUrl: string
    label: string
  }
> = {
  1: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
    logoUrl: '/images/networks/mainnet-network.jpg',
    label: 'Ethereum',
  },
  4: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3'],
    blockExplorerUrls: ['https://rinkeby.etherscan.com'],
    logoUrl: '/images/networks/rsk-network.jpg',
    label: 'RSK',
  },
}

function Row({
  targetChain,
  onSelectChain,
}: {
  targetChain: SupportedChainId
  onSelectChain: (targetChain: number) => void
}) {
  const { library, chainId } = useWeb3React()
  if (!library || !chainId) {
    return null
  }
  const active = chainId === targetChain
  const { label, logoUrl } = SUPPORTED_NETWORKS[targetChain]

  const rowContent = (
    <FlyoutRow onClick={() => onSelectChain(targetChain)} active={active}>
      <SubNetworkIcon src={logoUrl} width={30} height={30} />
      <NetworkLabel>{label}</NetworkLabel>
      {chainId === targetChain && (
        <CircleContainer>
          <FlyoutRowActiveIndicator />
        </CircleContainer>
      )}
    </FlyoutRow>
  )

  if (active) {
    return (
      <ActiveRowWrapper>
        {rowContent}
      </ActiveRowWrapper>
    )
  }
  return rowContent
}

const NETWORK_SELECTOR_CHAINS = [
  SupportedChainId.MAINNET,
  SupportedChainId.RINKEBY,
]

export default function NetworkSelector() {

  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null)

  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: 'fixed',
    placement: 'bottom-end',
    modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
  })


  const info = process.env.REACT_APP_CHAIN_ID ? SUPPORTED_NETWORKS[process.env.REACT_APP_CHAIN_ID] : undefined
  // console.log(chainId)

  const onSelectChain = useCallback(
    async () => {
      try {
        // await switchChain(connector, targetChain)
      } catch (error) {
        console.error('Failed to switch networks', error)
      }
    },
    []
  )

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true)
    }

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false)
        evt.stopPropagation()
      }
    }

    targetRef?.addEventListener('mouseenter', showDropdownMenu)
    targetRef?.addEventListener('mouseleave', hideDropdownMenu)

    return () => {
      targetRef?.removeEventListener('mouseenter', showDropdownMenu)
      targetRef?.removeEventListener('mouseleave', hideDropdownMenu)
    }
  }, [targetRef, tooltipRef, setIsOpen])

  return (
    <Flex alignItems="center" height="100%" ref={setTargetRef}>
      <SelectorControls
        onTouchStart={() => {
          setIsOpen((s) => !s)
        }}>
        <NetworkIcon src={info.logoUrl} height={40} width={40} />
      </SelectorControls>
      {isOpen && (
        <FlyoutMenu style={styles.popper} {...attributes.popper} ref={setTooltipRef}>
          <FlyoutMenuContents>
            <FlyoutHeader>
              {t('Select a network')}
            </FlyoutHeader>
            {NETWORK_SELECTOR_CHAINS.map((chain: SupportedChainId) =>
              <Row onSelectChain={onSelectChain} targetChain={chain} key={chain} />
            )}
          </FlyoutMenuContents>
        </FlyoutMenu>
      )}
    </Flex >
  )
}
