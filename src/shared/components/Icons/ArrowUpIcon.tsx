import type { IconProps } from "../../types";

export function ArrowUpIcon({ size = 14, className = "" }: IconProps) {
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
        d="M12 4L4 14H9V20H15V14H20L12 4Z"
        fill="currentColor"
      />
    </svg>
  );
}
