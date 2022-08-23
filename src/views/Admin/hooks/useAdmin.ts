import useActiveWeb3React from "hooks/useActiveWeb3React"
import { useMemo } from "react"
import { admins } from "../config/admins"

export const useAdmin = () => {
  const { account } = useActiveWeb3React()

  const isAdmin = useMemo(() => {
    return admins.find(admin => admin === account) !== undefined
  }, [account])

  return { isAdmin }
}