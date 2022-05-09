import React from "react";
import { SvgProps } from "../types";

interface LogoProps extends SvgProps {
  isDark: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDark, ...props }) => {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1229.24 352" fill="none" {...props}>
      <path d="M810.07,655.91H861.9V543.33H962.33V655.91h51.82V400.37H962.33V500.44H861.9V400.37H810.07Zm329,5.36c47.18,0,76.13-27.52,82.92-60h-47.89c-5.36,13.94-16.44,22.51-35.38,22.51-27.52,0-43.25-17.51-46.82-45.74h133c0-65.41-31.45-110.44-90.42-110.44-53.61,0-90.43,42.17-90.43,96.5C1044.05,618.74,1078.36,661.27,1139.12,661.27Zm-3.93-156.18c22.16,0,37.53,16.08,39,39.31h-81.49C1097,520.45,1109.46,505.09,1135.19,505.09Zm116.5,150.82h48.6V400.37h-48.6Zm84.18,0h48.61V472.56h-48.61Zm0-211.94h48.61v-43.6h-48.61Zm70.64,211.94h53.25l39.67-60.76h.72l33.95,60.76H1592l-65.41-97.57,56.83-85.78H1533l-30.74,52.54h-.72l-32.52-52.54h-55.4l59.69,86.14Z" transform="translate(-362.76 -352.32)" fill="#abbeff"/>
      <path d="M377.76,352.32a15,15,0,0,0-15,15v322a15,15,0,0,0,15,15h322a15,15,0,0,0,15-15v-322a15,15,0,0,0-15-15Zm170.12,176h84.79a2.1,2.1,0,0,1,1.94,1.31,2.21,2.21,0,0,1,.11,1.22,2,2,0,0,1-.57,1.08l-88.32,89.16a4.18,4.18,0,0,1-5.92,0L451,531.31a4.24,4.24,0,0,1,0-6l88.92-89.78a4.15,4.15,0,0,1,5.92,0L588,476.81a2.17,2.17,0,0,1,.59,1.08,2.15,2.15,0,0,1-.11,1.23,2.08,2.08,0,0,1-.77,1,2.06,2.06,0,0,1-1.17.37H499.64a4.24,4.24,0,0,0-1.61.32,4,4,0,0,0-1.35.92,4.11,4.11,0,0,0-.91,1.37,4.25,4.25,0,0,0-.32,1.62V572a4.23,4.23,0,0,0,1.23,3,4.17,4.17,0,0,0,3,1.24h86.88a2.16,2.16,0,0,0,1.18-.36,2.2,2.2,0,0,0,.77-1,2.15,2.15,0,0,0,.1-1.23,2.06,2.06,0,0,0-.59-1.08L546.43,532a2.15,2.15,0,0,1-.6-1.08,2.25,2.25,0,0,1,.11-1.23,2.14,2.14,0,0,1,.77-1A2.06,2.06,0,0,1,547.88,528.32Z" transform="translate(-362.76 -352.32)" fill="#abbeff" />
      </svg>


  );
};

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark);
