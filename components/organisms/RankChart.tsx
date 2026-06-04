'use client';

import Card from '@/components/atoms/Card';
import type { ResultWithMeta } from '@/lib/types';

// Dynamically import Recharts to avoid SSR issues
import dynamic from 'next/dynamic';

const LazyChart = dynamic(() => import('./RankChartInner'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-white/5 rounded-xl animate-pulse" />,
});

interface RankChartProps {
  results: ResultWithMeta[];
}

export default function RankChart({ results }: RankChartProps) {
  if (results.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Not enough data for a chart yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Rank Over Time
      </h3>
      <LazyChart results={results} />
    </Card>
  );
}
