import { useState } from "react";
import { FinancialTransaction, fetchFinancialTransactionByUniqueId } from "../api/fetchFinancialTransaction";
import { fetchPrograms } from "../api/fetchProgram";
import { fetchActionPlan } from "../api/fetchActionPlan";

export interface RecipientFinancialTransaction {
  value: number;
  transactionId: string;
  date: string;
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
      getRecipientsByProgram(financialTransactions, uniqueId);
    } catch (error) {
      setError(error as Error);
    }
    setLoading(false);
  }

  const getPrograms = async (financialTransactions: FinancialTransaction[], uniqueId: string) => {
    const programCodes = financialTransactions.map((transaction) => transaction.codigo_programa_agil_ente_solicitante_gestao_financeira);
    const uniquePrograms = Array.from(new Set(programCodes));
    const programs = await fetchPrograms(uniquePrograms);
    const actionPlans = await fetchActionPlan(uniqueId);

    const programsWithValues = programs.map((program) => {
      return {
        ...program,
        value: actionPlans.find((actionPlan) => actionPlan.id_programa === program.id_programa)?.valor_total_repasse_plano_acao || 0,
      }
    });

    const programsByCode = programsWithValues.reduce((acc, program) => {
      const code = program.codigo_programa_agil;
      if (!acc[code]) {
        acc[code] = {
          ...program,
          value: 0
        };
      }
      acc[code].value += program.value || 0;
      return acc;
    }, {} as Record<string, any>);

    const uniqueProgramsByCode = Object.values(programsByCode);

    const uniqueProgramsById = uniqueProgramsByCode
      .map((program) => {
        return {
          ...program,
          codigos_programas_agil_relacionados: programs.filter((p) => p.id_programa === program.id_programa).map((p) => p.codigo_programa_agil),
          nomes_programas_agil_relacionados: Array.from(new Set(programs.filter((p) => p.id_programa === program.id_programa).map((p) => p.nome_programa_agil))),
        }
      })

    // Remove duplicados com base no id_programa
    const seenIds = new Set();
    const uniqueProgramsByIdWithoutDuplicates = uniqueProgramsById.filter((program) => {
      if (seenIds.has(program.id_programa)) {
        return false;
      }
      seenIds.add(program.id_programa);
      return true;
    });

    return uniqueProgramsByIdWithoutDuplicates;
  }

  const getRecipientsByProgram = async (financialTransactions: FinancialTransaction[], uniqueId: string) => {
    const programs = await getPrograms(financialTransactions, uniqueId);

    const programsWithRecipients: ProgramWithRecipients[] = [];

    for (const program of programs) {
      const programTransactions = financialTransactions.filter((transaction) => program.codigos_programas_agil_relacionados.includes(transaction.codigo_programa_agil_ente_solicitante_gestao_financeira));

      const programRecipients = programTransactions
        .filter((transaction) => transaction.nome_favorecido_gestao_financeira) // remove recipients with null name
        .map((transaction) => `${transaction.nome_favorecido_gestao_financeira}_${transaction.doc_favorecido_gestao_financeira_mask}`);

      const uniqueProgramRecipients = Array.from(new Set(programRecipients))

      const programRecipientsWithValues: Recipient[] = [];
      for (const recipient of uniqueProgramRecipients) {
        const recipientTransactions = programTransactions.filter((transaction) => `${transaction.nome_favorecido_gestao_financeira}_${transaction.doc_favorecido_gestao_financeira_mask}` === recipient);
        programRecipientsWithValues.push({
          name: recipient.split("_")[0],
          uniqueId: recipient.split("_")[1],
          transactions: recipientTransactions.map((transaction) => ({
            value: transaction.valor_lancamento_gestao_financeira,
            transactionId: transaction.id_lancamento_gestao_financeira,
            date: transaction.data_lancamento_gestao_financeira,
          })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        });
      }


      programsWithRecipients.push({
        transactions: programTransactions,
        value: program.value || 0,
        program: {
          code: program.codigo_programa_agil,
          name: program.nomes_programas_agil_relacionados.join(", "),
        },
        recipients: programRecipientsWithValues.sort((a, b) => b.name.localeCompare(a.name)),
      });
    }
    setPrograms(programsWithRecipients);
  }

  return { getFinancialTransactions, financialTransactions, getRecipientsByProgram, programs, loading, error, setError };
}