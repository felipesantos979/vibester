# Testes E2E — Vibester

Testes end-to-end que fazem requisições HTTP reais contra os serviços em execução.

## Pré-requisitos

Todos os serviços precisam estar rodando localmente:

| Serviço                | Porta padrão |
|------------------------|-------------|
| post-service           | 3000        |
| auth-service           | 3001        |
| establishment-service  | 3002        |
| user-service           | 3003        |
| notification-service   | 3005        |
| feed-service           | 3006        |
| event-service          | 3334        |

## Instalação

```bash
cd e2e
npm install
```

## Configuração (opcional)

Copie `.env.example` para `.env` e ajuste as URLs caso os serviços rodem em portas diferentes:

```bash
cp .env.example .env
```

## Execução

```bash
# Todos os testes
npm test

# Suíte específica
npm run test:health        # Health checks de todos os serviços
npm run test:auth          # Registro e login
npm run test:user          # Perfis, follow/unfollow
npm run test:post          # Posts, likes, comentários
npm run test:event         # Eventos
npm run test:establishment # Estabelecimentos
npm run test:social        # Fluxo social completo (cross-service)
```

## Estrutura

```
e2e/
├── src/
│   ├── config.ts     # URLs dos serviços (via env vars)
│   ├── http.ts       # Cliente HTTP simples (fetch nativo)
│   ├── auth.ts       # Helper: registra + faz login, retorna token
│   ├── unique.ts     # Gera dados únicos por execução (evita conflitos)
│   └── setup.ts      # Pings de saúde antes dos testes
└── tests/
    ├── 01-health.spec.ts        # Health checks
    ├── 02-auth.spec.ts          # Auth flows
    ├── 03-user.spec.ts          # User profiles + follow/unfollow
    ├── 04-post.spec.ts          # Posts + likes + comentários
    ├── 05-event.spec.ts         # Events
    ├── 06-establishment.spec.ts # Establishments
    └── 07-social-flow.spec.ts   # Fluxo integrado Alice → Bob
```

## Observações

- Cada execução gera usuários únicos via timestamp — sem necessidade de limpar banco manualmente.
- O fluxo social (`07-social-flow`) aguarda propagação Kafka (até 8s) para validar o feed.
- Se um serviço não estiver rodando, os testes do arquivo correspondente falham com mensagem clara.
