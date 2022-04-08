import { useGetHelixBalance } from 'hooks/useTokenBalance'

const useGetVotingPower = () => {
  const { balance, fetchStatus } = useGetHelixBalance() 
  const helixBalance = balance
  const isLoading = fetchStatus === "FETCHING"
  return { helixBalance, isLoading }
}

export default useGetVotingPower
