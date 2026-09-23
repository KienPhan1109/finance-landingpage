import type { ChartBackgroundProps } from "../../types";
import { useChartWebGL } from "./useChartWebGL";
import "./ChartBackground.css";

export function ChartBackground(_props: ChartBackgroundProps) {
  const { canvasRef } = useChartWebGL();

  return (
    <div className="chart-bg-container">
      <canvas
        ref={canvasRef}
        className="chart-bg-canvas"
        aria-hidden="true"
      />
    </div>
  );
}
