import React, { useEffect, useState } from 'react'
import { useModal } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import ClaimNftModal from 'components/ClaimNftModal/ClaimNftModal'
import noop from 'lodash/noop'
import { useBunnySpecialXmasContract } from './useContract'

const useNftClaimStatusCheck = () => {
  const [hasDisplayedModal, setHasDisplayedModal] = useState(false)
  const { account } = useWeb3React()
  const [onPresentNftClaimModal] = useModal(<ClaimNftModal />)
  const bunnySpecialContract = useBunnySpecialXmasContract()

  useEffect(() => {
    const checkClaimStatus = async () => {
      try {
        const canClaim = await bunnySpecialContract.canClaim(account)
        if (canClaim) {
          onPresentNftClaimModal()
          setHasDisplayedModal(true)
        }
      } catch (error) {
        // User not registered throws here
        noop()
      }
    }
    if (account && !hasDisplayedModal) {
      checkClaimStatus()
    }
  }, [account, bunnySpecialContract, hasDisplayedModal, onPresentNftClaimModal])

  // Reset when account changes
  useEffect(() => {
    setHasDisplayedModal(false)
  }, [account])
}

export default useNftClaimStatusCheck
