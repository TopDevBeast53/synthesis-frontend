import { ethers } from 'ethers'

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_NODE_1)