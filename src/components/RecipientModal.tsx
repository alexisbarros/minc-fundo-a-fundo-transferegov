import { Recipient } from "../hooks/useFinancialTransaction";

interface RecipientModalProps {
    recipient: Recipient | null;
    isOpen: boolean;
    onClose: () => void;
}

export const RecipientModal: React.FC<RecipientModalProps> = ({ recipient, isOpen, onClose }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (!isOpen || !recipient) return null;

    const totalValue = recipient.transactions.reduce((acc, transaction) => acc + transaction.value, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header do Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {recipient.name || "Sem identificação"}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Documento: {recipient.uniqueId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-6">
                    {/* Resumo */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {recipient.transactions.length}
                                </div>
                                <div className="text-sm text-gray-600">Transações</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(totalValue)}
                                </div>
                                <div className="text-sm text-gray-600">Valor Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Transações */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Detalhes das Transações
                        </h3>
                        <div className="space-y-3">
                            {recipient.transactions.map((transaction, index) => (
                                <div
                                    key={transaction.transactionId}
                                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                                    #{index + 1}
                                                </span>
                                                <span className="text-sm font-mono text-gray-700">
                                                    ID: {transaction.transactionId}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-mono text-gray-700">
                                                {transaction.date ? new Date(transaction.date).toLocaleDateString('pt-BR') : ''}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-mono text-gray-700">
                                                {transaction.category}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">
                                                {formatCurrency(transaction.value)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer do Modal */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};