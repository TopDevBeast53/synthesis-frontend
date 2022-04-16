export interface TokenInfo {
  tokenId: string
  tokenOwner: string
  level: number
  helixPoints: number
  remainHPToNextLevel: number
  isStaked: boolean
  uri: string
  disabled: boolean
}