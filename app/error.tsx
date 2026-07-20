'use client';

import { useEffect } from 'react';
import Button from '@/components/atoms/Button';
import FailureCard from '@/components/atoms/FailureCard';

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error('[App] Unhandled page error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 md:p-10">
      <FailureCard
        label="Page unavailable"
        title="We couldn&apos;t load this page."
        message="Please try again. If the issue continues, return to the dashboard and start a new check."
      />
      <div className="mt-4">
        <Button type="button" onClick={() => unstable_retry()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
