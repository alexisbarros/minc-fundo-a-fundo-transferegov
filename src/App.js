import { FinancialMovementsTable } from './components/FinancialMovementsTable';
import { RecipientsTable } from './components/RecipientsTable';
import { useFinancialTransaction } from './hooks/useFinancialTransaction';

function App() {
  const { financialTransactions, getFinancialTransactions, loading, error, recipients } = useFinancialTransaction();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-blue-600">
      <header className="bg-white/10 backdrop-blur-lg py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Fundo a Fundo
          </h1>
          <p className="text-xl text-white/90">
            TransfereGov - Consulta de dados da API de dados abertos do módulo de Fundo a Fundo do Transferegov
          </p>
        </div>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="card p-6 md:p-8 animate-fade-in">
            <div className="mb-8">
              <label htmlFor="cnpj-input" className="block text-lg font-semibold text-gray-700 mb-3">
                Informe o CNPJ do ente:
              </label>
              <input
                type="text"
                id="cnpj-input"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="Ex: 00000000000000"
                maxLength="14"
                onChange={(e) => getFinancialTransactions(e.target.value)}
              />
            </div>

            {financialTransactions[0] &&
              <div className="bg-gradient-to-r from-red-50 to-blue-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  Nome do Ente: {financialTransactions[0].nome_ente_solicitante_gestao_financeira}
                </p>
              </div>}

            {loading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-red-600">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Carregando movimentações...
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && financialTransactions.length > 0 && (
              <>
                <div className="animate-slide-up">
                  <FinancialMovementsTable
                    movements={financialTransactions}
                    title="Movimentações Financeiras do Ente"
                  />
                </div>

                <div className="animate-slide-up mt-2">
                  <RecipientsTable
                    recipients={recipients}
                    title="Beneficiários das Transferências"
                  />
                </div>
              </>
            )}

            {/* Mensagem quando não há dados */}
            {!loading && financialTransactions.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-2">Nenhuma movimentação encontrada</p>
                  <p className="text-gray-600">Digite um CNPJ válido para visualizar as movimentações financeiras.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 