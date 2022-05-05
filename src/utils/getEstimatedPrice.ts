import BigNumber from 'bignumber.js'
import { BIG_ZERO } from './bigNumber'

/**
 * Function to return gasPrice outwith a react component
 */const getEstimatedPrice = (amount:BigNumber|string|number, price:BigNumber|string|number): BigNumber => {
  const a = new BigNumber(amount.toString())
  const b = new BigNumber(price.toString())  
  if(a.isNaN() || b.isNaN()) return BIG_ZERO  
  return a.times(b)
}

export default getEstimatedPrice
