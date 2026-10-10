import React from 'react';
import Svg, {Path} from 'react-native-svg';

export const HomeIcon = ({color, size}: {color: string; size: number}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 25" fill="none">
      <Path
        d="M3.34668 9.26572L12.3467 2.12286L21.3467 9.26572V20.4902C21.3467 21.0315 21.136 21.5506 20.7609 21.9333C20.3858 22.316 19.8771 22.531 19.3467 22.531H5.34668C4.81625 22.531 4.30754 22.316 3.93247 21.9333C3.55739 21.5506 3.34668 21.0315 3.34668 20.4902V9.26572Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.34668 22.531V12.3269H15.3467V22.531"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const BookIcon = ({color, size}: {color: string; size: number}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 25" fill="none">
      <Path
        d="M2 3.14355H8C9.06087 3.14355 10.0783 3.57358 10.8284 4.33904C11.5786 5.10449 12 6.14267 12 7.22519V21.5109C12 20.699 11.6839 19.9204 11.1213 19.3463C10.5587 18.7722 9.79565 18.4497 9 18.4497H2V3.14355Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 3.14355H16C14.9391 3.14355 13.9217 3.57358 13.1716 4.33904C12.4214 5.10449 12 6.14267 12 7.22519V21.5109C12 20.699 12.3161 19.9204 12.8787 19.3463C13.4413 18.7722 14.2044 18.4497 15 18.4497H22V3.14355Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const UserIcon = ({color, size}: {color: string; size: number}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
      <Path
        d="M20.5635 21.5101V19.4693C20.5635 18.3868 20.142 17.3486 19.3919 16.5832C18.6418 15.8177 17.6243 15.3877 16.5635 15.3877H8.56348C7.50261 15.3877 6.48519 15.8177 5.73505 16.5832C4.9849 17.3486 4.56348 18.3868 4.56348 19.4693V21.5101"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.5635 11.3068C14.7726 11.3068 16.5635 9.47941 16.5635 7.22519C16.5635 4.97096 14.7726 3.14355 12.5635 3.14355C10.3543 3.14355 8.56348 4.97096 8.56348 7.22519C8.56348 9.47941 10.3543 11.3068 12.5635 11.3068Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
