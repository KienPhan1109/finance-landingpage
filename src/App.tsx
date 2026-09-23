import {
  ChartBackground,
  HeroSection,
  PipelineTimeline,
  PIPELINE_STAGES,
  DUAL_CHART_DATA,
} from "./features/landing";
import { ErrorBoundary, useSmoothScroll } from "./shared";

export default function App() {
  useSmoothScroll();

  return (
    <main>
      {/* Unified Full-Viewport 3D Background */}
      <ErrorBoundary>
        <ChartBackground data={DUAL_CHART_DATA} />
      </ErrorBoundary>
      <HeroSection />
      <PipelineTimeline stages={PIPELINE_STAGES} />
    </main>
  );
}
