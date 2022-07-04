import styled from 'styled-components'
import Text from '../Text/Text'
import { tags, scales, HeadingProps } from './types'

const style = {
  [scales.MD]: {
    fontSize: '20px',
    fontSizeLg: '20px',
  },
  [scales.LG]: {
    fontSize: '24px',
    fontSizeLg: '24px',
  },
  [scales.XL]: {
    fontSize: '32px',
    fontSizeLg: '40px',
  },
  [scales.XXL]: {
    fontSize: '32px',
    fontSizeLg: '64px',
  },
}

const HeadingLeftAligned = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ scale }) => style[scale || scales.MD].fontSize};    
  font-weight: 600;
  line-height: 1.1;
  text-align: start;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: ${({ scale }) => style[scale || scales.MD].fontSize};    
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ scale }) => style[scale || scales.MD].fontSizeLg};
    font-weight: 800;
  }
`

HeadingLeftAligned.defaultProps = {
  as: tags.H2,
}

export default HeadingLeftAligned
