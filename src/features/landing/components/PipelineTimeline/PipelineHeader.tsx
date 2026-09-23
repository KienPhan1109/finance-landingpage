/**
 * Header for the Pipeline Timeline displaying section eyebrow, headline, and subtitle.
 */
export function PipelineHeader() {
  return (
    <header className="pipeline-header">
      <div className="pipeline-eyebrow">
        <span className="pipeline-pulse-dot" aria-hidden="true" />
        <span>SYSTEM ARCHITECTURE // END-TO-END PIPELINE</span>
      </div>
      <h2 className="pipeline-title">
        Our Investment <span className="pipeline-title-accent">Pipeline</span>
      </h2>
      <p className="pipeline-subtitle">
        A systematic five-stage process transforming raw market feeds into
        institutional-grade portfolios.
      </p>
    </header>
  );
}
