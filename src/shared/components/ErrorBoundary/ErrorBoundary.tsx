import { Component } from "react";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "../../types";
import "./ErrorBoundary.css";

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
        <div className="error-boundary-container" role="alert">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠</div>
            <h3 className="error-boundary-title">Chart Unavailable</h3>
            <p className="error-boundary-message">
              The interactive chart could not be rendered.
            </p>
            {this.state.error !== null && (
              <details className="error-boundary-details">
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
