import React from 'react'
import { SvgProps } from '../types'

interface LogoProps extends SvgProps {
  isDark: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Logo: React.FC<LogoProps> = ({ isDark, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 565 259" fill="none" {...props}>
      <g filter="url(#filter0_d_1849_76)">
        <rect x="30" y="30" width="199" height="199" rx="30" fill="#ABBEFF" />
      </g>
      <path
        d="M182.589 129.5H134.653C134.417 129.501 134.187 129.572 133.992 129.706C133.797 129.839 133.645 130.028 133.557 130.249C133.468 130.469 133.447 130.712 133.496 130.944C133.545 131.177 133.661 131.39 133.83 131.556L157.322 154.514C157.492 154.68 157.609 154.892 157.658 155.125C157.707 155.358 157.686 155.6 157.597 155.821C157.509 156.042 157.357 156.23 157.162 156.363C156.966 156.496 156.735 156.567 156.5 156.566H107.378C106.75 156.566 106.148 156.315 105.704 155.866C105.26 155.418 105.011 154.81 105.011 154.177V104.824C105.011 104.51 105.072 104.2 105.191 103.91C105.31 103.62 105.484 103.356 105.704 103.134C105.924 102.913 106.185 102.736 106.472 102.616C106.759 102.496 107.067 102.434 107.378 102.434H156.503C156.739 102.434 156.969 102.362 157.164 102.229C157.36 102.096 157.511 101.907 157.599 101.686C157.688 101.466 157.709 101.223 157.66 100.99C157.611 100.758 157.495 100.545 157.326 100.379L133.496 77.0579C133.052 76.61 132.45 76.3584 131.822 76.3584C131.194 76.3584 130.592 76.61 130.149 77.0579L79.8765 127.811C79.4328 128.259 79.1836 128.867 79.1836 129.5C79.1836 130.134 79.4328 130.742 79.8765 131.19L130.149 181.943C130.592 182.391 131.194 182.642 131.822 182.642C132.45 182.642 133.052 182.391 133.496 181.943L183.426 131.542C183.591 131.374 183.704 131.162 183.749 130.93C183.795 130.698 183.771 130.458 183.682 130.24C183.592 130.021 183.441 129.835 183.246 129.703C183.052 129.572 182.823 129.501 182.589 129.5Z"
        fill="#443430"
      />
      <path
        d="M293.215 170H311.161V131.013H345.94V170H363.886V81.5064H345.94V116.161H311.161V81.5064H293.215V170ZM407.163 171.857C423.5 171.857 433.525 162.326 435.877 151.064H419.292C417.436 155.891 413.599 158.861 407.039 158.861C397.509 158.861 392.063 152.796 390.826 143.019H436.867C436.867 120.369 425.976 104.775 405.554 104.775C386.989 104.775 374.241 119.379 374.241 138.192C374.241 157.128 386.123 171.857 407.163 171.857ZM405.802 117.77C413.475 117.77 418.797 123.34 419.292 131.385H391.073C392.558 123.092 396.89 117.77 405.802 117.77ZM446.143 170H462.975V81.5064H446.143V170ZM475.295 170H492.127V106.507H475.295V170ZM475.295 96.606H492.127V81.5064H475.295V96.606ZM499.755 170H518.197L531.935 148.96H532.182L543.94 170H563.991L541.341 136.212L561.02 106.507H543.569L532.925 124.701H532.677L521.415 106.507H502.231L522.9 136.335L499.755 170Z"
        fill="#ABBEFF"
      />
      <defs>
        <filter
          id="filter0_d_1849_76"
          x="0"
          y="0"
          width="259"
          height="259"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="15" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
        </filter>
      </defs>
    </svg>
  )
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark)
