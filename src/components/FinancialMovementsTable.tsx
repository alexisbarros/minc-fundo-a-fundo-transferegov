import React, { useState } from 'react';
import { FinancialTransaction } from '../api/fetchFinancialTransaction';

interface FinancialMovementsTableProps {
  movements: FinancialTransaction[];
  title?: string;
}

export const FinancialMovementsTable: React.FC<FinancialMovementsTableProps> = ({
  movements,
  title = "Movimentações Financeiras"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header do Card */}
      <div
        className="bg-gradient-to-r from-red-50 to-blue-50 px-6 py-4 cursor-pointer hover:from-red-100 hover:to-blue-100 transition-all duration-200"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {title}
            </h3>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {movements.length} movimentações
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {isExpanded ? 'Ocultar' : 'Expandir'}
            </span>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Conteúdo Expansível */}
      {isExpanded && (
        <div className="animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome do Favorecido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID da Operação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements
                  .sort((a, b) => new Date(b.data_lancamento_gestao_financeira).getTime() - new Date(a.data_lancamento_gestao_financeira).getTime())
                  .map((movement, index) => (
                    <tr
                      key={movement.id_lancamento_gestao_financeira}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(movement.data_lancamento_gestao_financeira)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        <div className="tooltip-container">
                          <span className="truncate block">
                            {movement.nome_favorecido_gestao_financeira || "Sem identificação"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {movement.id_lancamento_gestao_financeira}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {formatCurrency(movement.valor_lancamento_gestao_financeira)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Resumo */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total de movimentações: <span className="font-semibold">{movements.length}</span>
              </div>
              <div className="text-sm text-gray-600">
                Valor total: <span className="font-semibold text-green-600">
                  {formatCurrency(
                    movements.reduce((sum, movement) => sum + movement.valor_lancamento_gestao_financeira, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 