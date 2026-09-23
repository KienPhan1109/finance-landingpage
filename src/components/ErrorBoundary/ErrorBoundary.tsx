import { Component } from "react";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "../../types";
import styles from "./ErrorBoundary.module.css";

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorContainer} role="alert">
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>⚠</div>
            <h3 className={styles.errorTitle}>Chart Unavailable</h3>
            <p className={styles.errorMessage}>
              The interactive chart could not be rendered.
            </p>
            {this.state.error !== null && (
              <details className={styles.errorDetails}>
                <summary>Technical details</summary>
                <code>{this.state.error.message}</code>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
