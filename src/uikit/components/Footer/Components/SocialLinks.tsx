import { ReactComponent as GeometryIconNoCircle } from "images/icon-noCircle-geometry.svg";
import { ReactComponent as HelixIconNoCircle } from "images/icon-noCircle-helix.svg";
import { ReactComponent as NexusIconNoCircle } from "images/icon-noCircle-nexus.svg";
import React from 'react';
import { FlexProps } from '../../Box';
import Flex from '../../Box/Flex';
import Link from '../../Link/Link';

// const SocialLinks: React.FC<FlexProps> = ({ ...props }) => (
//   <Flex {...props}>
//     {socials.map((social, index) => {
//       const iconProps = {
//         iconName: social.icon,
//         width: '20px',
//         color: darkColors.textSubtle,
//         style: { cursor: 'pointer' },
//       }
//       const mr = index < socials.length - 1 ? '24px' : 0

//       return (
//         <Link external key={social.label} href={social.href} aria-label={social.label} mr={mr}>
//           <IconComponent {...iconProps} />
//         </Link>
//       )
//     })}
//   </Flex>
// )
const SocialLinks:React.FC<FlexProps> = ({...props}) => (
  <Flex {...props}>
    <Link href="https://geometry.fi" mr="16px">
      <GeometryIconNoCircle style={{width:"32px"}}/>
    </Link>
    <Link href="https://helix.finance" mr="16px">
      <HelixIconNoCircle style={{width:"32px"}}/>
    </Link>
    <Link href="https://nexus.helix.finance">
      <NexusIconNoCircle style={{width:"32px"}}/>
    </Link>
  </Flex>
)
export default React.memo(SocialLinks, () => true)
