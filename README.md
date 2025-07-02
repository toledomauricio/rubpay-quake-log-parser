# Rubpay Quake Log Parser

API desenvolvida em NestJS para analisar logs do jogo Quake e extrair estatísticas de partidas.

## Funcionalidades do projeto

- Total de kills por jogo
- Kills por meio de morte (armas/causas)
- Kills causadas pela entidade `<world>`

## Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Docker e Docker Compose (opcional)

### Opção 1: Execução Local

1. **Clone o repositório e instale as dependências:**
```bash
npm install
```

2. **Execute em modo de desenvolvimento:**
```bash
npm run start:dev
```

3. **Ou compile e execute em produção:**
```bash
npm run build
npm run start:prod
```

### Opção 2: Execução com Docker

1. **Execute com Docker Compose:**
```bash
docker-compose up -d --build
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── app.module.ts          # Módulo principal
├── main.ts                # Entrypoint
├── game.controller.ts     # Controller com os endpoints da API
├── game.service.ts        # Service com regra de negócio
├── interfaces/
│   └── game-result.interface.ts  # Interface dos resultados
└── parsers/
    ├── log-parser.ts      # Abstração de métodos para ler arquivo
    └── game-log-parser.ts # Parser dos logs do Quake
```

## Endpoints da API

### GET /games
Retorna todas as partidas com suas estatísticas.

**Resposta:**
```json
[
  {
    "game": "game_1",
    "total_kills": 11,
    "world_kills": 1,
    "kills_by_means": {
      "MOD_TRIGGER_HURT": 7,
      "MOD_ROCKET_SPLASH": 3,
      "MOD_FALLING": 1
    }
  }
]
```

### GET /games/:gameId
Retorna informações de uma partida específica.

**Exemplo:** `GET /games/game_2`

**Resposta:**
```json
{
  "game": "game_2",
  "total_kills": 11,
  "world_kills": 1,
  "kills_by_means": {
    "MOD_TRIGGER_HURT": 7,
    "MOD_ROCKET_SPLASH": 3,
    "MOD_FALLING": 1
  }
}
```

## Tecnologias Utilizadas

- **NestJS**: Framework
- **TypeScript**: Linguagem de programação
- **Docker**: Containers
- **Express**: Servidor HTTP (via NestJS)

## Comandos Disponíveis

- `npm run build`: Compila o projeto
- `npm run start`: Inicia a aplicação
- `npm run start:dev`: Inicia em modo de desenvolvimento com live reload
- `npm run start:prod`: Inicia a versão compilada para produção

## Atenção ao arquivo de log

O arquivo `games.log` deve estar localizado na raiz do projeto. Se estiver em outro local, ajuste o caminho no `GameService`.

### Porta
A aplicação roda na porta 3000 por padrão. Para alterar, modifique o arquivo `main.ts`.

## Exemplo de Uso

1. Inicie a aplicação
2. Acesse `http://localhost/games` para ver todas as partidas
3. Acesse `http://localhostgames/game_2` para ver uma partida específica

Os dados retornados podem ser utilizados para:
- Dashboards de estatísticas
- Análise de performance dos jogadores
- Relatórios de partidas
- Integração com outros sistemas

## Escolha da Arquitetura

O projeto segue uma arquitetura modular com separação clara de responsabilidades:

- **Controllers**: Gerenciam as requisições HTTP, apenas tráfego dos dados
- **Services**: Contêm a lógica de negócio
- **Parsers**: Responsáveis pela análise dos logs
- **Interfaces**: Definem os tipos de dados

## Testando a API

Você pode testar os endpoints usando curl ou postman:

```bash
# Listar todas as partidas
curl http://localhost/games

# Obter partida específica
curl http://localhost/games/game_2
```

Ou importe a collection do Postman aqui: [Quake_Logs_API.postman_collection.json](./Quake_Logs_API.postman_collection.json)
```