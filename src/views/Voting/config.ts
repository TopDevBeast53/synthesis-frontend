import { ChainId } from 'sdk'

export const PROPOSALS_TO_SHOW = 10
export const ADMINS = [
    '0x06aC5E1A19D227Dc92bec75F9Aae05b4e0C499A9',
    '0x50aA3d33800A1BF4B8ED76740Fd52dfB4Bb503E7', // HELIX TEAM
].map((address) => address.toLowerCase())
export const IPFS_GATEWAY = 'https://gateway.ipfs.io/ipfs'
export const SNAPSHOT_VERSION = '0.1.3'
const chainId = process.env.REACT_APP_CHAIN_ID
export const HELIX_SPACE = Number(chainId) === ChainId.MAINNET ? "helixgeometry.eth" : "silverstardev.eth"
export const VOTE_THRESHOLD = 500
export const CHOICES_PRESET = ['In Favor', 'Against']
export const STRATEGY2_SNAPSHOT = '15245369'
