# Fundo a Fundo - TransfereGov

Uma aplicação React moderna para consulta de dados de entes federativos, construída com Tailwind CSS.

## Funcionalidades

- Lista de entes federativos carregada via API
- Select para escolha do ente
- Exibição de dados detalhados do ente selecionado
- Interface responsiva e moderna com Tailwind CSS
- Tratamento de estados de loading e erro
- Animações suaves e transições

## Tecnologias Utilizadas

- React 18
- Tailwind CSS para estilização
- Axios para requisições HTTP
- PostCSS e Autoprefixer
- Create React App

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute a aplicação em modo de desenvolvimento:
```bash
npm start
```

3. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Projeto

```
fundo-a-fundo-transferegov/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Componente principal
│   ├── index.js        # Ponto de entrada
│   └── index.css       # Estilos globais e Tailwind
├── tailwind.config.js  # Configuração do Tailwind
├── postcss.config.js   # Configuração do PostCSS
├── package.json
└── README.md
```

## Configuração das APIs

A aplicação atualmente usa dados simulados. Para conectar com APIs reais:

1. No arquivo `src/App.js`, descomente as linhas de chamada da API
2. Substitua as URLs pelos endpoints reais:

```javascript
// Para carregar lista de entes
const response = await axios.get('https://sua-api.com/entes');

// Para carregar dados do ente
const response = await axios.get(`https://sua-api.com/entes/${enteId}/dados`);
```

## Tailwind CSS

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

## Scripts Disponíveis

- `npm start` - Executa a aplicação em modo de desenvolvimento
- `npm build` - Cria a versão de produção
- `npm test` - Executa os testes
- `npm eject` - Ejetar configurações do Create React App

## Licença

Este projeto é de uso interno para o TransfereGov. 