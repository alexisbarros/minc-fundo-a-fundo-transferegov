import axios from "axios";
import { API_URL } from "../constants";

export interface ActionPlan {
    id_plano_acao: number;
    id_programa: number;
    valor_total_repasse_plano_acao: number;
}

export const fetchActionPlan = async (uniqueId: string): Promise<ActionPlan[]> => {
    let response;
    response = await axios.get<ActionPlan[]>(`${API_URL}/plano_acao?cnpj_ente_recebedor_plano_acao=eq.${uniqueId}`);
    if (response.data.length === 0) {
        response = await axios.get<ActionPlan[]>(`${API_URL}/plano_acao?cnpj_fundo_recebedor_plano_acao=eq.${uniqueId}`);
    }
    return response.data;
}