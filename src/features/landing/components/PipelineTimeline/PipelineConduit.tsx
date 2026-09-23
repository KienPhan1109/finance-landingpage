/**
 * Energy Conduit Beam connecting the 3D WebGL bottom aura directly into the Pipeline Timeline.
 */
export function PipelineConduit() {
  return (
    <div className="pipeline-conduit-wrapper" aria-hidden="true">
      <div className="pipeline-conduit-glow" />
      <div className="pipeline-conduit-beam" />
      <div className="pipeline-conduit-pulse" />
      <div className="pipeline-conduit-core" />
    </div>
  );
}
