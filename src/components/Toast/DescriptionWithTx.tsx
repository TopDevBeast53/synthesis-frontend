import React from 'react'
import { Link, Text } from 'uikit'
import { getEtherScanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import { BASE_SCAN_NAMES } from 'config'

interface DescriptionWithTxProps {
  // description?: string
  txHash?: string
}

const DescriptionWithTx: React.FC<DescriptionWithTxProps> = ({ txHash, children }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={getEtherScanLink(txHash, 'transaction', chainId)}>
          {t(`View on ${BASE_SCAN_NAMES[chainId]}`)}: {truncateHash(txHash, 8, 0)}
        </Link>
      )}
    </>
  )
}

export default DescriptionWithTx
