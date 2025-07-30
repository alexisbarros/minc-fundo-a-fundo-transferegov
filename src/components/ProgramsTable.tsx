import React, { useState } from 'react';
import { Recipient } from '../hooks/useFinancialTransaction';

interface ProgramsTableProps {
  recipients: Recipient[];
  totalValue?: number;
  title?: string;
}

export const ProgramsTable: React.FC<ProgramsTableProps> = ({
  recipients,
  totalValue = 0,
  title = "Programa não identificado"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
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
              {recipients.length} beneficiários
            </span>

            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {formatCurrency(totalValue)}
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
                    Nome do Beneficiário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento do Beneficiário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identificação da transferência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Transferido
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recipients
                  .sort((a, b) => b.transactions.reduce((acc, transaction) => acc + transaction.value, 0) - a.transactions.reduce((acc, transaction) => acc + transaction.value, 0))
                  .map((recipient, index) => (
                    <tr
                      key={recipient.uniqueId}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {recipient.name || "Sem identificação"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {recipient.uniqueId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {recipient.transactions.map((transaction, idx) => (
                          <span className="relative group" key={transaction.transactionId}>
                            <span>
                              {transaction.transactionId}
                              {idx < recipient.transactions.length - 1 && ", "}
                            </span>
                            <span className="absolute left-1/2 -translate-x-1/2 mt-2 z-10 hidden group-hover:flex px-3 py-1 rounded bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg transition-opacity duration-200 opacity-90 pointer-events-none">
                              Valor: {formatCurrency(transaction.value)}
                            </span>
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {formatCurrency(recipient.transactions.reduce((acc, transaction) => acc + transaction.value, 0))}
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
                Total de beneficiários: <span className="font-semibold">{recipients.length}</span>
              </div>
              <div className="text-sm text-gray-600">
                Valor total: <span className="font-semibold text-green-600">
                  {formatCurrency(
                    recipients.reduce((sum, recipient) => sum + recipient.transactions.reduce((acc, transaction) => acc + transaction.value, 0), 0)
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