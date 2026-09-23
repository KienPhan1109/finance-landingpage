import type { ArrowIconProps } from "../../types";

export function ArrowDownIcon({ size = 14, className = "" }: ArrowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 20L20 10H15V4H9V10H4L12 20Z"
        fill="currentColor"
      />
    </svg>
  );
}
