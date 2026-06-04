import Badge from '@/components/atoms/Badge';

interface StatusBadgeProps {
  appears: boolean;
  rank: number | null;
}

/** Shows rank as a colored badge, or a clear not-found state. */
export default function StatusBadge({ appears, rank }: StatusBadgeProps) {
  if (!appears) {
    return (
      <Badge variant="danger">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
        Not in top 10
      </Badge>
    );
  }

  const variant = rank && rank <= 3 ? 'success' : rank && rank <= 5 ? 'info' : 'warning';

  return (
    <Badge variant={variant}>
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          variant === 'success'
            ? 'bg-emerald-400'
            : variant === 'info'
            ? 'bg-cyan-400'
            : 'bg-amber-400'
        }`}
      />
      Rank: {rank}
    </Badge>
  );
}
