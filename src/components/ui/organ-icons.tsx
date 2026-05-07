import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function LiverIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 7c-2-3-6.5-2-9 0-3.5-1-8 1-9.5 5.5-.5 1.5 0 3 1.5 4.5 2.5 2.5 7 3.5 11 2 3-1 5.5-5 6-12z" />
      <path d="M12 7v7" />
    </svg>
  );
}

export function KidneyIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16.5 4.5c2.5 1.5 4 5.5 2.5 9.5-1.5 4-7 6-11 4C5 16.5 4 12 6 8.5c1.5-3 5.5-5.5 10.5-4z" />
      <path d="M6 12h3" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
