'use client';

import { COLORS } from '@package/tokens/ts';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { YAxisTickContentProps } from 'recharts/types/util/types';
import type { ChartDatum } from './chart';

const LINE_COLOR = `rgb(${COLORS['card-surface-selected']})`;
const GRID_COLOR = `rgb(${COLORS['card-chart-grid']})`;
const AXIS_COLOR = `rgb(${COLORS['card-content-muted']})`;

interface ChartProps {
  data: ChartDatum[];
}

const compactFormatter = new Intl.NumberFormat('en', { notation: 'compact' });

const CustomYTick = ({ x, y, payload }: YAxisTickContentProps) => (
  <text
    x={Number(x) + 8}
    y={y}
    dx={14}
    dy={-6}
    textAnchor="end"
    fontSize={10}
    fill={AXIS_COLOR}
  >
    {compactFormatter.format(payload.value)}
  </text>
);

export const DataChartLine = ({ data }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" aspect={1.78}>
      <LineChart data={data} margin={{ top: 16, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={{ stroke: AXIS_COLOR }}
          axisLine={{ stroke: AXIS_COLOR }}
          tick={{ fontSize: 10, fill: AXIS_COLOR }}
          tickMargin={6}
          padding={{ left: 28 }}
        />
        <YAxis width={1} tickLine={false} axisLine={false} tick={CustomYTick} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={LINE_COLOR}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
