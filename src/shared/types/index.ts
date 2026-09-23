import type { ReactNode } from "react";

/** Shared props for SVG arrow and utility icons */
export interface IconProps {
  readonly size?: number;
  readonly className?: string;
}

/** Props for the ErrorBoundary wrapper */
export interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

/** Internal state for the ErrorBoundary component */
export interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}
