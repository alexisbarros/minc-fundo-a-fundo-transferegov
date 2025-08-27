import axios from "axios";
import { API_URL } from "../constants";

export interface Category {
    id_categoria_despesa_gestao_financeira: number,
    id_nivel_pai_categoria_despesa_gestao_financeira: number,
    nome_nivel_atual_categoria_despesa_gestao_financeira: string,
    nivel_atual_categoria_despesa_gestao_financeira: number,
    nome_completo_niveis_categoria_despesa_gestao_financeira: string,
    codigo_programa_agil: number,
    nome_programa_agil: string
}

export const fetchCategories = async (): Promise<Category[]> => {
    let page = 1;
    let finished = false;
    let categories: Category[] = [];
    while (!finished) {
        const response = await axios.get<Category[]>(`${API_URL}/gestao_financeira_categorias_despesa?limit=1000&offset=${(page - 1) * 1000}`);
        categories.push(...response.data);
        if (response.data.length < 100) {
            finished = true;
        }
        page++;
    }
    return categories;
}