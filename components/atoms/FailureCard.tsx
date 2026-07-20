import Card from '@/components/atoms/Card';

type FailureCardProps = {
  title: string;
  message: string;
  label?: string;
};

export default function FailureCard({
  title,
  message,
  label = 'Unable to continue',
}: FailureCardProps) {
  return (
    <Card className="border-[#f4f1e8]" padding="lg">
      <div className="max-w-lg">
        <p className="eyebrow mb-3">{label}</p>
        <h2 className="display-type text-2xl font-bold text-[#f4f1e8]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#f4f1e8]/60">{message}</p>
      </div>
    </Card>
  );
}
