
import { useCreditQueries } from './credits/useCreditQueries';
import { useCreditTransactions } from './credits/useCreditTransactions';
import { useCreditAccess } from './credits/useCreditAccess';

export const useUserCredits = () => {
  const {
    credits,
    transactions,
    creditsLoading,
    transactionsLoading,
    creditsError
  } = useCreditQueries();

  const {
    createTransaction,
    useCredits,
    isProcessing
  } = useCreditTransactions();

  const {
    checkUserAccess,
    deductAnalysisCredits
  } = useCreditAccess();

  return {
    credits,
    transactions,
    creditsLoading,
    transactionsLoading,
    creditsError,
    createTransaction,
    useCredits,
    checkUserAccess,
    deductAnalysisCredits,
    isProcessing
  };
};
