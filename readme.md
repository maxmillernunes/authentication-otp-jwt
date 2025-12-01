# Authentication OTP + JWT

Projeto que implementa um fluxo de autenticação por OTP (one-time password) enviado por e‑mail para validar o login e emitir um JWT ao usuário.

## Resumo rápido
- Usuário solicita sign-in informando o email → é gerado um OTP de 6 dígitos (válido por 30 minutos) e enviado por e‑mail.
- Usuário valida o OTP (id + código) → recebe um JWT com 1h de validade.
- Também há rota para sign-up (criação de usuário) que envia e‑mail de boas-vindas.

## Tecnologias
- Node.js v22+
- TypeScript
- Express 5
- Prisma + PostgreSQL
- JWT (jsonwebtoken)
- Mailtrap (envio de e‑mail) em modo sandbox
- Zod para validação de entrada

## Arquitetura (visão rápida)
- Controllers: camada de entrada HTTP ([src/infra/controllers](src/infra/controllers))
  - [src/infra/controllers/users/sign-in.ts](src/infra/controllers/users/sign-in.ts)
  - [src/infra/controllers/users/sign-up.ts](src/infra/controllers/users/sign-up.ts)
  - [src/infra/controllers/users/validate-otp.ts](src/infra/controllers/users/validate-otp.ts)
- Use cases: regras de negócio
  - [src/use-cases/sign-in.ts](src/use-cases/sign-in.ts)
  - [src/use-cases/sign-up.ts](src/use-cases/sign-up.ts)
  - [src/use-cases/validate-otp.ts](src/use-cases/validate-otp.ts)
- Providers
  - JWT: [`JWTProvider`](src/auth/provider/jwt.ts)
  - Email: [`MailTrapProvider`](src/email/providers/mailtrap.ts)
- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)
- Rotas: [src/infra/routes/index.ts](src/infra/routes/index.ts)
- Config de ambiente: [src/env/index.ts](src/env/index.ts)
- Docker: [Dockerfile](Dockerfile) e [docker-compose.yml](docker-compose.yml)

## Variáveis de ambiente
- Veja [src/env/index.ts](src/env/index.ts) e [`.env.example`](.env.example)
  - NODE_ENV (development | production | test) — default: development
  - PORT — default: 3333
  - DATABASE_URL — URL de conexão Postgres (ex.: postgres://user:pass@host:5432/db?schema=public)
  - JWT_SECRET — segredo para assinar JWTs (obrigatório)
  - SENDGRID_API_KEY / MAILTRAP_API_TOKEN — chaves para envio de e‑mail (no projeto está sendo usado Mailtrap)

## Instalação (local)
1. Instale dependências (recomendado pnpm):
   ```bash
   pnpm install
   ```
2. Configure o arquivo `.env` a partir de `.env.example`.
3. Execute migrações e gere cliente Prisma:
   ```bash
   pnpm prisma migrate deploy
   pnpm prisma generate
   ```
4. Start em modo dev:
   ```bash
   pnpm run start:dev
   ```
   (script disponível em [package.json](package.json): `start:dev`)

## Rodando com Docker
- Build e run com Docker Compose:
  ```bash
  docker compose up --build
  ```
  O `docker-compose.yml` já define serviço do Postgres e da API. (Veja [docker-compose.yml](docker-compose.yml) e [Dockerfile](Dockerfile)).

## API — Endpoints principais
- Health check
  - GET /health
  - Controller: [src/infra/controllers/health-check.ts](src/infra/controllers/health-check.ts) (rota em [src/infra/routes/index.ts](src/infra/routes/index.ts))
- Sign-up (criar usuário)
  - POST /auth/signup
  - Body: { "name": "string (min 3)", "email": "email" }
  - Resposta: 201 + usuário criado
  - Controller: [src/infra/controllers/users/sign-up.ts](src/infra/controllers/users/sign-up.ts)
- Sign-in (gerar OTP)
  - POST /auth/signin
  - Body: { "email": "email" }
  - Resposta: 200 + { otpId: string } — id do OTP gerado
  - Controller: [src/infra/controllers/users/sign-in.ts](src/infra/controllers/users/sign-in.ts)
  - Observações: o OTP gerado tem 6 dígitos — função geradora em [src/use-cases/sign-in.ts](src/use-cases/sign-in.ts)
- Validate (validar OTP e emitir token)
  - POST /auth/validate
  - Body: { "otpId": "uuid", "otp": "string (6)" }
  - Resposta: 200 + { token: string, user: User }
  - Controller: [src/infra/controllers/users/validate-otp.ts](src/infra/controllers/users/validate-otp.ts)
  - Geração do JWT: [`JWTProvider`](src/auth/provider/jwt.ts) — expira em 1 hora
- Profile (rota para testar o token)
  - get /profile
  - Header: {authorization: bearer token}
  - Resposta: 200 + { user: User }
  - Controller: [src/infra/controllers/users/profile.ts](src/infra/controllers/users/profile.ts)
  - Verificação do jwt: [src/infra/middlewares/ensure-authenticate.ts](src/infra/middlewares/ensure-authenticate.ts)
  

## Exemplos (curl)
- Sign-up
  ```bash
  curl -X POST http://localhost:3333/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"Fulano","email":"fulano@example.com"}'
  ```
- Sign-in
  ```bash
  curl -X POST http://localhost:3333/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"fulano@example.com"}'
  ```
- Validate OTP
  ```bash
  curl -X POST http://localhost:3333/auth/validate \
    -H "Content-Type: application/json" \
    -d '{"otpId":"<OTP_ID>","otp":"123456"}'
  ```

## Regras e comportamento importantes
- OTP: 6 dígitos, gerado aleatoriamente em [src/use-cases/sign-in.ts](src/use-cases/sign-in.ts), expira em 30 minutos.
- Quando o OTP é validado com sucesso, o registro é marcado como `used = true` em banco (Prisma).
- JWT assinado com `env.JWT_SECRET` e `expiresIn: '1h'` (veja [src/auth/provider/jwt.ts](src/auth/provider/jwt.ts)).
- Envio de e‑mail por Mailtrap (ambiente de testes). Configure `MAILTRAP_API_TOKEN` em `.env`.

## Banco de dados / Prisma
- Schema: [prisma/schema.prisma](prisma/schema.prisma)
- Migração de exemplo gerada em: [prisma/migrations/.../migration.sql](prisma/migrations/)
- Gerador do client configurado no schema (`output = "../generated/prisma"`). Execute `pnpm prisma generate` após configurar `.env`.

## Boas práticas / Produção
- Mantenha `JWT_SECRET` seguro e não o versionar no repositório.
- Use provedores de e‑mail apropriados em produção (SendGrid, SES etc.) e ajuste provider.
- Considere limitar tentativas de login / validação de OTP (rate limiting, bloqueio por IP).

## Onde olhar no código
- Rotas: [src/infra/routes/index.ts](src/infra/routes/index.ts)
- Controllers: [src/infra/controllers/users](src/infra/controllers/users)
- Use Cases: [src/use-cases](src/use-cases)
- JWT provider: [src/auth/provider/jwt.ts](src/auth/provider/jwt.ts)
- Mail provider: [src/email/providers/mailtrap.ts](src/email/providers/mailtrap.ts)
- Validações: arquivos usam `zod` (ex.: controllers)

## Contribuição
- Abra issues para bugs/feature requests.
- Pull requests com testes e descrição clara são bem-vindos.
- Sugestão: adicione testes unitários/integração e cobertura para use-cases.

## Licença
- Nenhuma licença definida no repositório. Recomenda-se adicionar uma (por exemplo MIT) se for abrir o projeto.

## Contato / Observações finais
- Projeto simples, objetivo e focado em fluxo OTP → JWT. Para dúvidas sobre o código, veja diretamente os use-cases e providers mencionados acima.