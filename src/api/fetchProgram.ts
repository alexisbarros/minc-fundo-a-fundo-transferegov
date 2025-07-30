import axios from "axios";
import { API_URL } from "../constants";

export interface Program {
    nome_programa_agil: string;
    codigo_programa_agil: string;
}

export const fetchPrograms = async (ids: string[]): Promise<Program[]> => {
    const response = await axios.get<Program[]>(`${API_URL}/programa_gestao_agil?codigo_programa_agil=in.(${ids.join(',')})`);
    return response.data;
}