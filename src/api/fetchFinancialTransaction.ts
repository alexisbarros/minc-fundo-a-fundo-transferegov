import axios from "axios";
import { API_URL } from "../constants";

export interface FinancialTransaction {
    id_lancamento_gestao_financeira: string;
    descricao_origem_solicitacao_gestao_financeira: string;
    cnpj_ente_solicitante_gestao_financeira: string;
    nome_ente_solicitante_gestao_financeira: string;
    nome_favorecido_gestao_financeira: string;
    doc_favorecido_gestao_financeira_mask: string;
    valor_lancamento_gestao_financeira: number;
    data_lancamento_gestao_financeira: string;
    codigo_programa_agil_ente_solicitante_gestao_financeira: string;
    id_categoria_despesa_gestao_financeira: number;
}

export const fetchFinancialTransactionByUniqueId = async (uniqueId: string): Promise<FinancialTransaction[]> => {
    let finished = false;
    let page = 1;
    let financialTransactions: FinancialTransaction[] = [];
    while (!finished) {
        const response = await axios.get<FinancialTransaction[]>(`${API_URL}/gestao_financeira_lancamentos?cnpj_ente_solicitante_gestao_financeira=eq.${uniqueId}&tipo_operacao_gestao_financeira=eq.D&limit=100&offset=${(page - 1) * 100}`);
        financialTransactions.push(...response.data);
        if (response.data.length < 100) {
            finished = true;
        }
        page++;
    }
    return financialTransactions;
};