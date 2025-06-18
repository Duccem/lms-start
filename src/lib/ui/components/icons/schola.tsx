import { SVGProps } from "react";
const ScholaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    height={100}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="#ffe0c2" d="M12 2 2 7v10l10 5 10-5V7L12 2Z" />
    <path fill="#ffe0c2" d="M12 2 2 7v5l10 5 10-5V7L12 2Z" />
    <path fill="#fbb874" d="M12 17 2 12v5l10 5 10-5v-5l-10 5Z" />
  </svg>
);
export default ScholaIcon;

