export interface TokenInfo {
  tokenId: string
  tokenOwner: string
  level: number
  auraPoints: number
  remainAPToNextLevel: number
  isStaked: boolean
  uri: string
  disabled: boolean
}