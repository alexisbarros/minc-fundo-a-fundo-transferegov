import { useState } from "react";
import { FinancialTransaction, fetchFinancialTransactionByUniqueId } from "../api/fetchFinancialTransaction";

export interface Recipient {
  name: string;
  uniqueId: string;
  transactions: FinancialTransaction[];
  value: number;
}

export function useFinancialTransaction() {
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  const getFinancialTransactions = async (uniqueId: string) => {
    if (uniqueId.length !== 14) return;
    setLoading(true);
    try {
      const financialTransactions = await fetchFinancialTransactionByUniqueId(uniqueId);
      setFinancialTransactions(financialTransactions);
      getRecipients(financialTransactions);
    } catch (error) {
      setError(error as Error);
    }
    setLoading(false);
  }

  const getRecipients = (financialTransactions: FinancialTransaction[]) => {
    const recipients = financialTransactions.map((transaction) => `${transaction.nome_favorecido_gestao_financeira}_${transaction.doc_favorecido_gestao_financeira_mask}`);
    const uniqueRecipients = Array.from(new Set(recipients));
    const recipientsWithValues: Record<string, Recipient> = {};
    
    for (const recipient of uniqueRecipients) {
      const recipientTransactions = financialTransactions.filter((transaction) => `${transaction.nome_favorecido_gestao_financeira}_${transaction.doc_favorecido_gestao_financeira_mask}` === recipient);
      const totalValue = recipientTransactions.reduce((acc, transaction) => acc + transaction.valor_lancamento_gestao_financeira, 0);
      recipientsWithValues[recipient] = {
        name: recipient.split("_")[0],
        uniqueId: recipient.split("_")[1],
        transactions: recipientTransactions,
        value: totalValue,
      };
    }
    setRecipients(Object.values(recipientsWithValues));
  }

  return { getFinancialTransactions, financialTransactions, getRecipients, recipients, loading, error, setError };
}