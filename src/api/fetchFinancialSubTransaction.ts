import axios from "axios";
import { API_URL } from "../constants";

export interface FinancialSubTransaction {
    id_lancamento_gestao_financeira: string;
    id_subtransacao_gestao_financeira: string;
    numero_documento_beneficiario_subtransacao_gestao_financeira_ma: string;
    nome_beneficiario_subtransacao_gestao_financeira: string;
    valor_subtransacao_gestao_financeira: number;
    data_pagamento_subtransacao_gestao_financeira: string;
}

export const fetchFinancialSubTransactionByTransactionIds = async (transactionIds: string[]): Promise<FinancialSubTransaction[]> => {
    let page = 1;
    let finished = false;
    let financialSubTransactions: FinancialSubTransaction[] = [];
    while (!finished) {
        const response = await axios.get<FinancialSubTransaction[]>(`${API_URL}/gestao_financeira_subtransacoes?id_lancamento_gestao_financeira=in.(${transactionIds.join(',')})&offset=${(page - 1) * 1000}&limit=1000`);
        financialSubTransactions.push(...response.data);
        if (response.data.length < 100) {
            finished = true;
        }
        page++;
    }
    return financialSubTransactions;
};