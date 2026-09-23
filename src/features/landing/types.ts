/** A single bar data point (volume / assets) */
export interface BarDataPoint {
  readonly label: string;
  readonly value: number;
}

/** A single line data point (performance trend) */
export interface LineDataPoint {
  readonly label: string;
  readonly value: number;
}

/** Full dual-chart data structure with pre-computed bounds */
export interface DualChartData {
  readonly bars: ReadonlyArray<BarDataPoint>;
  readonly line: ReadonlyArray<LineDataPoint>;
  readonly barMaxValue: number;
  readonly lineMinValue: number;
  readonly lineMaxValue: number;
}

/** Props for the ChartBackground component */
export interface ChartBackgroundProps {
  readonly data: DualChartData;
}

/** Data structure for a single ticker item in the marquee */
export interface TickerItem {
  readonly id: string;
  readonly symbol: string;
  readonly companyName: string;
  readonly price: number;
  readonly changePercent: number;
  readonly direction: "up" | "down";
}

/** Props for the TickerMarquee component */
export interface TickerMarqueeProps {
  readonly items: ReadonlyArray<TickerItem>;
}

/** Navigation link item */
export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly isActive: boolean;
}

/** Props for the Navbar component */
export interface NavbarProps {
  readonly items: ReadonlyArray<NavItem>;
}

/** A single list item inside a glass card */
export interface GlassCardListItem {
  readonly label: string;
  readonly value: string;
  readonly accent?: string;
}

/** Data for a single floating glass card */
export interface GlassCardData {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly subtitle?: string;
  readonly position: "left-top" | "left-bottom" | "center" | "right-top" | "right-bottom";
  readonly items?: ReadonlyArray<GlassCardListItem>;
}

/** Props for the GlassCards component */
export interface GlassCardsProps {
  readonly cards: ReadonlyArray<GlassCardData>;
}

/** A single stage in the investment pipeline */
export interface PipelineStage {
  readonly id: string;
  readonly stageNumber: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly input: string;
  readonly engine: string;
  readonly output: string;
  readonly icon: string;
}

/** Props for the PipelineTimeline component */
export interface PipelineTimelineProps {
  readonly stages: ReadonlyArray<PipelineStage>;
}
