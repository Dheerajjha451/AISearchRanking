import HistoryContent from './HistoryContent';
import { getSearchHistory } from '@/lib/db/search-history';
import type { SearchHistory } from '@/lib/types';

export default async function HistoryPage() {
  let history: SearchHistory[] = [];
  let error: string | undefined;

  try {
    history = await getSearchHistory();
  } catch (caughtError) {
    console.error('[History] Failed to load search history:', caughtError);
    error = 'Failed to load history. Please try again.';
  }

  return <HistoryContent history={history} error={error} />;
}
