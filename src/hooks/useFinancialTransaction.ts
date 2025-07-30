import { useState } from "react";
import { FinancialTransaction, fetchFinancialTransactionByUniqueId } from "../api/fetchFinancialTransaction";
import { fetchPrograms } from "../api/fetchProgram";

export interface RecipientFinancialTransaction {
  value: number;
  transactionId: string;
}

export interface Recipient {  
  name: string;
  uniqueId: string;
  transactions: RecipientFinancialTransaction[];
}

export interface Program {
  code: string;
  name: string;
}

export interface ProgramWithRecipients {
  transactions: FinancialTransaction[];
  value: number;
  program: Program;
  recipients: Recipient[];
}

export function useFinancialTransaction() {
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [programs, setPrograms] = useState<ProgramWithRecipients[]>([]);

  const getFinancialTransactions = async (uniqueId: string) => {
    if (uniqueId.length !== 14) return;
    setLoading(true);
    try {
      const financialTransactions = await fetchFinancialTransactionByUniqueId(uniqueId);
      setFinancialTransactions(financialTransactions);
      getRecipientsByProgram(financialTransactions);
    } catch (error) {
      setError(error as Error);
    }
    setLoading(false);
  }

  const getPrograms = async (financialTransactions: FinancialTransaction[]) => {
    const programCodes = financialTransactions.map((transaction) => transaction.codigo_programa_agil_ente_solicitante_gestao_financeira);
    const uniquePrograms = Array.from(new Set(programCodes));
    const programs = await fetchPrograms(uniquePrograms);
    const uniqueProgramsByCode = programs.filter(
      (program, index, self) =>
        index === self.findIndex((p) => p.codigo_programa_agil === program.codigo_programa_agil)
    );
    return uniqueProgramsByCode;
  }

  const getRecipientsByProgram = async (financialTransactions: FinancialTransaction[]) => {
    const programs = await getPrograms(financialTransactions);

    const programsWithRecipients: ProgramWithRecipients[] = [];

    for (const program of programs) {
      const programTransactions = financialTransactions.filter((transaction) => transaction.codigo_programa_agil_ente_solicitante_gestao_financeira === program.codigo_programa_agil);
      const totalValue = programTransactions.reduce((acc, transaction) => acc + transaction.valor_lancamento_gestao_financeira, 0);
      
      const programRecipients = programTransactions.map((transaction) => `${transaction.nome_favorecido_gestao_financeira}_${transaction.doc_favorecido_gestao_financeira_mask}`);
      const uniqueProgramRecipients = Array.from(new Set(programRecipients));
      const programRecipientsWithValues: Recipient[] = [];
      for (const recipient of uniqueProgramRecipients) {
        const recipientTransactions = programTransactions.filter((transaction) => `${transaction.nome_favorecido_gestao_financeira}_${transaction.doc_favorecido_gestao_financeira_mask}` === recipient);
        programRecipientsWithValues.push({
          name: recipient.split("_")[0],
          uniqueId: recipient.split("_")[1],
          transactions: recipientTransactions.map((transaction) => ({
            value: transaction.valor_lancamento_gestao_financeira,
            transactionId: transaction.id_lancamento_gestao_financeira,
          })),
        });
      }

      
      programsWithRecipients.push({
        transactions: programTransactions,
        value: totalValue,
        program: {
          code: program.codigo_programa_agil,
          name: program.nome_programa_agil,
        },
        recipients: programRecipientsWithValues.sort((a, b) => b.name.localeCompare(a.name)),
      });
    }
    setPrograms(programsWithRecipients);
  }

  return { getFinancialTransactions, financialTransactions, getRecipientsByProgram, programs, loading, error, setError };
}