import type { PipelineStage } from "../../types";

interface PipelineStationCardProps {
  readonly stage: PipelineStage;
  readonly isActive: boolean;
  readonly isLast: boolean;
}

/**
 * Individual data station card representing a pipeline stage with glassmorphic styling.
 */
export function PipelineStationCard({ stage, isActive, isLast }: PipelineStationCardProps) {
  const activeClass = isActive ? "pipeline-station-active" : "";

  return (
    <div className={`pipeline-station-group ${activeClass}`}>
      <div className="pipeline-station">
        <div className="pipeline-station-node" aria-hidden="true">
          <div className="pipeline-node-core" />
          <div className="pipeline-node-ring" />
        </div>

        <div className="pipeline-stage-badge">
          <span>STAGE {stage.stageNumber}</span>
          <span className="pipeline-badge-sep">//</span>
          <span>{stage.shortTitle}</span>
        </div>

        <article className="pipeline-card">
          <div className="pipeline-card-glow" aria-hidden="true" />
          <header className="pipeline-card-header">
            <span className="pipeline-card-icon" aria-hidden="true">{stage.icon}</span>
            <h3 className="pipeline-card-title">{stage.title}</h3>
          </header>
          <p className="pipeline-card-desc">{stage.description}</p>
          <div className="pipeline-flow-rows">
            <div className="pipeline-flow-row">
              <span className="pipeline-flow-label">INPUT</span>
              <span className="pipeline-flow-val">{stage.input}</span>
            </div>
            <div className="pipeline-flow-row">
              <span className="pipeline-flow-label">ENGINE</span>
              <span className="pipeline-flow-val">{stage.engine}</span>
            </div>
            <div className="pipeline-flow-row">
              <span className="pipeline-flow-label">OUTPUT</span>
              <span className="pipeline-flow-val pipeline-flow-accent">{stage.output}</span>
            </div>
          </div>
        </article>
      </div>

      {!isLast && (
        <div className="pipeline-connector-rail" aria-hidden="true">
          <div className="pipeline-rail-track" />
          <div className="pipeline-photon-particle" />
        </div>
      )}
    </div>
  );
}
