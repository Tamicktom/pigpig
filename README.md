# PIGPIG

**P**rocura de **I**ntegrantes para **G**rupos de **P**rojeto **I**ntegrador em **G**rupo

Plataforma web para ajudar alunos da [UNIVESP](https://univesp.br/) a encontrar colegas e montar grupos de Projeto Integrador (PI) de forma mais organizada — sem depender apenas de dezenas de grupos informais no WhatsApp.

## Sobre o projeto

Na UNIVESP, a formação de grupos de PI costuma acontecer por DRP (Diretoria Regional Pedagógica). O PIGPIG centraliza essa busca: alunos da mesma DRP podem **criar grupos**, **solicitar entrada** em grupos existentes e **aceitar ou recusar** pedidos, com limites de vagas alinhados às regras do PI.

**Visitantes sem conta** podem explorar grupos publicamente (listagem e detalhes), o que facilita descobrir quem já está se organizando antes de se cadastrar.

### Principais funcionalidades

- Cadastro e login com **Laravel Fortify** (e-mail, telefone, DRP no registro)
- Descoberta **pública** de grupos (`/groups`)
- Criação de grupos e gestão de **pedidos de entrada** (aceitar/recusar)
- Organização por **DRP**; polos regionais são carregados via seed a partir de dados institucionais
- Interface em **português (pt_BR)** e **inglês (en)**
- E-mails transacionais: **Mailpit** no desenvolvimento local; **Resend** em staging/produção

## Stack tecnológica

| Camada        | Tecnologia                                      |
|---------------|--------------------------------------------------|
| Backend       | PHP 8.4, Laravel 13, Fortify, Inertia Laravel 3 |
| Frontend      | React 19, Inertia React 3, Tailwind CSS 4, Vite |
| Banco         | PostgreSQL 16                                   |
| Cache / filas | Redis 7                                         |
| Testes        | PHPUnit, Pest (suporte), Laravel Dusk (E2E)       |

Documentação complementar:

- [Arquitetura e regras de negócio](arquitetura.md)
- [Deploy no Coolify](docs/COOLIFY.md)
- [E-mail (Mailpit / Resend)](docs/email-migration.md)
- [Design system](docs/design/DESIGN.md)

## Pré-requisitos

**Recomendado (Docker Compose):**

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose v2

**Alternativa (sem Docker):**

- PHP 8.4 com extensões: `pdo_pgsql`, `redis`, `mbstring`, `intl`, `gd`, `zip`, `bcmath`, etc.
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) 22+ e npm
- PostgreSQL 16 e Redis 7 em execução local

## Como rodar (Docker Compose)

Este é o fluxo suportado para desenvolvimento local. Os serviços sobem **PostgreSQL**, **Redis**, **Mailpit**, a aplicação PHP (`app`), o **worker** de filas e o **Vite** para hot reload do frontend.

### 1. Clonar e configurar o ambiente

```bash
git clone <url-do-repositorio> pigpig
cd pigpig
cp .env.example .env
```

Ajuste o `.env` se necessário. Para Docker, mantenha os hosts de serviço (`DB_HOST=postgres`, `REDIS_HOST=redis`, `MAIL_HOST=mailpit`) como no `.env.example` e defina:

```env
APP_NAME=PIGPIG
APP_URL=http://localhost:8000
```

Gere a chave da aplicação e rode as migrações **dentro do container**:

```bash
docker compose up -d
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed
```

O seed carrega **DRPs e polos** a partir de `database/seeders/polos_drp.csv` e cria um usuário de teste (`test@example.com` — use a factory/senha padrão do projeto ou redefina conforme necessário).

### 2. Acessar a aplicação

| Serviço        | URL / porta padrão                          |
|----------------|---------------------------------------------|
| Aplicação web  | http://localhost:8000                       |
| Vite (HMR)     | http://localhost:5173                       |
| Mailpit (UI)   | http://localhost:8025                       |
| PostgreSQL     | `localhost:5432` (usuário/senha no `.env`)  |
| Redis          | `localhost:6379`                            |

Portas publicadas podem ser alteradas com `FORWARD_APP_PORT`, `FORWARD_VITE_PORT`, etc. no `.env` (veja comentários em `.env.example`).

### 3. Comandos úteis no Docker

Execute **Artisan**, **Composer**, **testes** e **Pint** sempre no serviço `app`:

```bash
# Logs / status
docker compose ps
docker compose logs -f app

# Artisan
docker compose exec app php artisan route:list
docker compose exec app php artisan queue:restart

# Testes
docker compose exec app php artisan test --compact

# Formatação PHP
docker compose exec app vendor/bin/pint --dirty --format agent
```

O serviço `worker` processa filas Redis (`queue:work`). O serviço `vite` executa `npm run dev` com HMR para o frontend.

## Como rodar (sem Docker)

```bash
composer install
cp .env.example .env
php artisan key:generate
```

No `.env`, aponte `DB_HOST` e `REDIS_HOST` para `127.0.0.1` (ou seus hosts locais) e configure SMTP do Mailpit se estiver usando e-mail local.

```bash
php artisan migrate
php artisan db:seed
npm install
npm run build   # ou npm run dev em outro terminal
composer run dev   # sobe servidor, fila, logs e Vite juntos
```

A aplicação ficará disponível em `http://127.0.0.1:8000` (porta padrão do `artisan serve`).

## Testes

```bash
# Com Docker
docker compose exec app php artisan test --compact

# Arquivo ou filtro específico
docker compose exec app php artisan test --compact tests/Feature/GroupJoinRequestTest.php

# Testes de integração com Mailpit (opcional)
docker compose exec app composer run test:mailpit
```

Antes de abrir um PR, o projeto também expõe checagens de frontend e PHP:

```bash
composer run ci:check
```

## Produção

Para deploy em servidor (por exemplo [Coolify](https://coolify.io/)), use o [`Dockerfile`](Dockerfile) na raiz (imagem web na porta **8080**, target opcional **worker** para filas). Siga o guia [docs/COOLIFY.md](docs/COOLIFY.md) e configure `MAIL_MAILER=resend` com domínio verificado na Resend.

## Estrutura resumida

```
app/                 # Lógica Laravel (controllers, models, policies…)
resources/js/        # Páginas e componentes React (Inertia)
routes/web.php       # Rotas web principais
database/seeders/    # DRPs, polos e dados iniciais
docker-compose.yml   # Ambiente de desenvolvimento
docs/                # Guias de deploy, e-mail, UI, design
```

## Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT) (ver `composer.json`).
