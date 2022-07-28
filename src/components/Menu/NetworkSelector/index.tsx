import React, { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'contexts/Localization'
import { SupportedChainId, CHAIN_IDS_TO_NAMES, SUPPORTED_NETWORKS } from 'config/constants/networks'
import { usePopper } from 'react-popper'
import { Flex, Image } from 'uikit'
import styled from 'styled-components/macro'
import { useHistory } from 'react-router-dom'
import usePreviousValue from 'hooks/usePreviousValue'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { ParsedQs } from 'qs'
import { replaceURLParam } from 'utils/routes'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

// import { isChainAllowed, switchChain } from 'utils/switchChain'

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

function Row({
  targetChain,
  onSelectChain,
}: {
  targetChain: SupportedChainId
  onSelectChain: (targetChain: number) => void
}) {
  const { chainId } = useActiveWeb3React()
  if (!chainId) {
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
  SupportedChainId.RSK_MAINNET,
]

const getParsedChainId = (parsedQs?: ParsedQs) => {
  const chain = parsedQs?.chain
  if (!chain || typeof chain !== 'string') return { urlChain: undefined, urlChainId: undefined }

  return { urlChain: chain.toLowerCase(), urlChainId: getChainIdFromName(chain) }
}

const getChainIdFromName = (name: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entry = Object.entries(CHAIN_IDS_TO_NAMES).find(([_, n]) => n === name)
  const chainId = entry?.[0]
  return chainId ? parseInt(chainId) : undefined
}

const getChainNameFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_NAMES[id as SupportedChainId] || ''
}

export default function NetworkSelector() {
  const { chainId } = useActiveWeb3React()
  const previousChainId = usePreviousValue(chainId)
  const parsedQs = useParsedQueryString()
  const { urlChain, urlChainId } = getParsedChainId(parsedQs)
  const previousUrlChainId = usePreviousValue(urlChainId)
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null)

  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: 'fixed',
    placement: 'bottom-end',
    modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
  })

  const history = useHistory()

  const info = chainId ? SUPPORTED_NETWORKS[chainId] : undefined

  const onSelectChain = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (targetChain: number, skipToggle?: boolean) => {
      try {
        // await switchChain(connector, targetChain)
        history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(targetChain)) })
      } catch (error) {
        console.error('Failed to switch networks', error)
      }
    },
    [history]
  )

  useEffect(() => {
    if (!chainId || !previousChainId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (chainId !== previousChainId && chainId !== urlChainId) {
      history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
      // otherwise assume network change originates from URL
    } else if (urlChainId && urlChainId !== previousUrlChainId && urlChainId !== chainId) {
      onSelectChain(urlChainId, true).catch(() => {
        // we want app network <-> chainId param to be in sync, so if user changes the network by changing the URL
        // but the request fails, revert the URL back to current chainId
        history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
      })
    }
  }, [chainId, urlChainId, previousChainId, previousUrlChainId, onSelectChain, history])

  // set chain parameter on initial load if not there
  useEffect(() => {
    if (chainId && !urlChainId) {
      history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
    }
  }, [chainId, history, urlChainId, urlChain])

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

  if (!info) {
    return null
  }

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
              // isChainAllowed(connector, chainId) ? (
              <Row onSelectChain={onSelectChain} targetChain={chain} key={chain} />
              // ) : null
            )}
          </FlyoutMenuContents>
        </FlyoutMenu>
      )}
    </Flex >
  )
}
