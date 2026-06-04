'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ResultWithMeta } from '@/lib/types';

const providerColors: Record<string, string> = {
  perplexity: '#22d3ee',
  chatgpt: '#10b981',
  gemini: '#6366f1',
};

interface RankChartInnerProps {
  results: ResultWithMeta[];
}

export default function RankChartInner({ results }: RankChartInnerProps) {
  // Group results by run_at timestamp, then pivot providers into columns
  const timeMap = new Map<string, Record<string, number>>();

  for (const r of results) {
    const timeKey = new Date(r.run_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (!timeMap.has(timeKey)) {
      timeMap.set(timeKey, {});
    }
    const entry = timeMap.get(timeKey)!;
    // Use rank or 0 if not found
    entry[r.provider_name] = r.rank ?? 0;
  }

  // Convert to array sorted by time
  const chartData = Array.from(timeMap.entries())
    .map(([time, values]) => ({ time, ...values }))
    .reverse(); // oldest first

  const providers = [...new Set(results.map((r) => r.provider_name))];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <YAxis
          reversed
          domain={[0, 'dataMax + 1']}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
          label={{
            value: 'Rank',
            angle: -90,
            position: 'insideLeft',
            fill: '#6b7280',
            fontSize: 11,
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111827',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
          labelStyle={{ color: '#9ca3af', fontSize: 12 }}
          itemStyle={{ fontSize: 12 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#9ca3af' }}
        />
        {providers.map((provider) => (
          <Line
            key={provider}
            type="monotone"
            dataKey={provider}
            stroke={providerColors[provider] || '#9ca3af'}
            strokeWidth={2}
            dot={{ fill: providerColors[provider] || '#9ca3af', r: 4 }}
            activeDot={{ r: 6 }}
            name={provider.charAt(0).toUpperCase() + provider.slice(1)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
