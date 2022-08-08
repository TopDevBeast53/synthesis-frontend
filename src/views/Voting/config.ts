import { ChainId } from 'sdk'

export const PROPOSALS_TO_SHOW = 10
export const ADMINS = [
    '0x50aA3d33800A1BF4B8ED76740Fd52dfB4Bb503E7', // HELIX TEAM
].map((address) => address.toLowerCase())
export const IPFS_GATEWAY = 'https://gateway.ipfs.io/ipfs'
export const SNAPSHOT_VERSION = '0.1.3'
export const HELIX_SPACE = {
    [ChainId.MAINNET]: 'helixgeometry.eth',
    [ChainId.TESTNET]: 'silverstardev.eth',
    [ChainId.RSK_MAINNET]: 'helixgeometryrsk.eth',
    [ChainId.RSK_TESTNET]: 'helixgeomtryrsktest.eth',
    // [ChainId.BSC_MAINNET]: 'helixgeomtrybsc.eth',
    // [ChainId.BSC_TESTNET]: 'helixgeomtrybsctest.eth'
}
export const VOTE_THRESHOLD = 500
export const CHOICES_PRESET = ['In Favor', 'Against']
export const STRATEGY2_SNAPSHOT = '15245369'
