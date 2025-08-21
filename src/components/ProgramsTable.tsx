import React, { useState } from 'react';
import { Recipient } from '../hooks/useFinancialTransaction';
import { RecipientModal } from './RecipientModal';

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
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const openRecipientModal = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setIsModalOpen(true);
  };

  const closeRecipientModal = () => {
    setIsModalOpen(false);
    setSelectedRecipient(null);
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
              Recebido: {formatCurrency(totalValue)}
            </span>

            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Transferido: {formatCurrency(recipients.reduce((sum, recipient) => sum + recipient.transactions.reduce((acc, transaction) => acc + transaction.value, 0), 0))}
            </span>
          </div>
          <div className="flex items-center space-x-2">
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
          <div>
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Nome do Beneficiário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    Documento do Beneficiário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    Identificação da transferência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                        <button
                          onClick={() => openRecipientModal(recipient)}
                          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                        >
                          {recipient.name || "Sem identificação"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {recipient.uniqueId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 truncate">
                        {recipient.transactions.map((transaction, idx) => (
                          <span className="relative group" key={transaction.transactionId}>
                            <span>
                              {transaction.transactionId}
                              {idx < recipient.transactions.length - 1 && ", "}
                            </span>
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 truncate">
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

      {/* Modal do Recipient */}
      {isModalOpen && selectedRecipient && (
        <RecipientModal
          recipient={selectedRecipient}
          isOpen={isModalOpen}
          onClose={closeRecipientModal}
        />
      )}
    </div>
  );
}; 