# Fundo a Fundo - TransfereGov

Uma aplicação React moderna para consulta de dados de entes federativos, construída com TypeScript e Tailwind CSS. A aplicação permite visualizar movimentações financeiras e beneficiários de transferências do módulo Fundo a Fundo do TransfereGov.

## 🚀 Funcionalidades

### 📊 **Consulta de Dados**
- **Input de CNPJ**: Campo para inserir o CNPJ do ente federativo
- **Carregamento automático**: Dados são carregados automaticamente ao digitar um CNPJ válido
- **Validação**: Verificação de CNPJ com 14 dígitos

### 📋 **Tabelas Expansíveis**
- **Movimentações Financeiras**: Tabela com data, nome do favorecido, ID da operação e valor
- **Beneficiários**: Tabela com nome, documento, quantidade de transferências e valor total
- **Ordenação**: Beneficiários ordenados do maior para o menor valor
- **Interatividade**: Cards expansíveis com seta para ocultar/exibir conteúdo

### 🎨 **Interface Moderna**
- **Design responsivo**: Funciona perfeitamente em desktop e mobile
- **Gradiente vermelho/azul**: Tema visual consistente
- **Animações suaves**: Transições e efeitos hover
- **Estados visuais**: Loading, erro e dados vazios bem definidos

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **PostCSS** - Processador CSS
- **Create React App** - Configuração inicial

## 📁 Estrutura do Projeto

```
fundo-a-fundo-transferegov/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FinancialMovementsTable.tsx    # Tabela de movimentações
│   │   └── RecipientsTable.tsx            # Tabela de beneficiários
│   ├── hooks/
│   │   └── useFinancialTransaction.ts     # Hook customizado
│   ├── api/
│   │   └── fetchFinancialTransaction.ts   # Funções de API
│   ├── App.js                             # Componente principal
│   ├── index.js                           # Ponto de entrada
│   └── index.css                          # Estilos globais e Tailwind
├── tailwind.config.js                     # Configuração do Tailwind
├── postcss.config.js                      # Configuração do PostCSS
├── tsconfig.json                          # Configuração do TypeScript
├── package.json
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd fundo-a-fundo-transferegov
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute a aplicação:**
```bash
npm start
```

4. **Acesse no navegador:**
```
http://localhost:3000
```

## 📊 Como Usar

1. **Digite um CNPJ** no campo de entrada (ex: `00000000000000`)
2. **Aguarde o carregamento** automático dos dados
3. **Visualize as movimentações** na primeira tabela expansível
4. **Veja os beneficiários** na segunda tabela, ordenados por valor
5. **Clique nas setas** para expandir/ocultar os detalhes

## 🔧 Configuração das APIs

A aplicação atualmente usa dados simulados. Para conectar com APIs reais:

### 1. **Configurar endpoints reais**
No arquivo `src/api/fetchFinancialTransaction.ts`:

```typescript
// Substitua pela URL real da API
const API_BASE_URL = 'https://api.transferegov.gov.br';

export const fetchFinancialTransactionByUniqueId = async (uniqueId: string) => {
  const response = await fetch(`${API_BASE_URL}/fundo-a-fundo?cnpj=${uniqueId}`);
  return response.json();
};
```

### 2. **Estrutura de dados esperada**
```typescript
interface FinancialTransaction {
  id_lancamento_gestao_financeira: string;
  nome_favorecido_gestao_financeira: string;
  valor_lancamento_gestao_financeira: number;
  data_lancamento_gestao_financeira: string;
  nome_ente_solicitante_gestao_financeira: string;
  cnpj_ente_solicitante_gestao_financeira: string;
  doc_favorecido_gestao_financeira_mask: string;
}
```

## 🎨 Tailwind CSS

O projeto utiliza Tailwind CSS para estilização, oferecendo:

- **Design System Consistente**: Cores, tipografia e espaçamentos padronizados
- **Responsividade**: Classes utilitárias para diferentes breakpoints
- **Componentes Customizados**: Classes reutilizáveis definidas em `src/index.css`
- **Animações**: Transições suaves e efeitos hover
- **Performance**: CSS otimizado e purged automaticamente

### Classes Customizadas

- `.btn-primary`: Botão primário com hover effects
- `.card`: Container com sombra e bordas arredondadas
- `.input-select`: Input select estilizado com focus states
- `.tooltip-container`: Container para tooltips
- `.tooltip`: Estilo dos tooltips

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Executa a aplicação em modo de desenvolvimento

# Produção
npm run build      # Cria a versão de produção otimizada

# Testes
npm test           # Executa os testes
npm run test:watch # Executa os testes em modo watch

# Configuração
npm run eject      # Ejetar configurações do Create React App
```

## 🔍 Funcionalidades Técnicas

### **Hook Customizado**
- `useFinancialTransaction`: Gerencia estado das transações e beneficiários
- **Estados**: loading, error, financialTransactions, recipients
- **Funções**: getFinancialTransactions, getRecipients

### **Componentes Reutilizáveis**
- `FinancialMovementsTable`: Tabela expansível para movimentações
- `RecipientsTable`: Tabela expansível para beneficiários
- **Props tipadas**: TypeScript para melhor desenvolvimento

### **Tipagem TypeScript**
- Interfaces bem definidas para todos os dados
- Tipagem de props dos componentes
- Autocomplete e verificação de erros em tempo de desenvolvimento

## 🎯 Próximos Passos

- [ ] Integração com API real do TransfereGov
- [ ] Filtros por período e valor
- [ ] Exportação de dados (CSV, PDF)
- [ ] Gráficos e visualizações
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)

## 📄 Licença

Este projeto é de uso interno para o TransfereGov.

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe do TransfereGov. 