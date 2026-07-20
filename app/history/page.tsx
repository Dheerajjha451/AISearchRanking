import HistoryContent from './HistoryContent';
import { getSearchHistory } from '@/lib/db/search-history';
import type { SearchHistory } from '@/lib/types';

export default async function HistoryPage() {
  let history: SearchHistory[] = [];
  let error: string | undefined;

  try {
    history = await getSearchHistory();
  } catch (caughtError) {
    error = caughtError instanceof Error ? caughtError.message : 'Failed to load history';
  }

  return <HistoryContent history={history} error={error} />;
}
