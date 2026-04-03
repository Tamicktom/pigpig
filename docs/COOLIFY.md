# Guia: rodar o Pigpig no Coolify

Este projeto usa o [`Dockerfile`](../Dockerfile) na raiz: imagem **web** (Nginx + PHP-FPM + Inertia SSR) na porta **8080**, e um target opcional **worker** para filas Redis.

## Pré-requisitos

- Um servidor com [Coolify](https://coolify.io/) instalado.
- Repositório Git acessível pelo Coolify (GitHub, GitLab, Gitea, etc.).
- Domínio apontando para o servidor (opcional no início; podes usar URL temporária do Coolify).

## Visão geral

| Recurso | Descrição |
|--------|-----------|
| **Aplicação web** | Build com Dockerfile (stage final `web`). Porta do container: **8080**. |
| **Worker (opcional)** | Segunda aplicação com o **mesmo** repositório e Dockerfile, stage **`worker`**, para `queue:work`. |
| **PostgreSQL** | Base de dados (o projeto usa `DB_CONNECTION=pgsql`). |
| **Redis** | Fila e cache (`QUEUE_CONNECTION=redis`, `CACHE_STORE=redis`). |

---

## Passo 1: Criar PostgreSQL e Redis no Coolify

1. No projeto ou ambiente, cria um recurso **Database** → **PostgreSQL** (versão compatível, ex.: 16).
2. Anota o **host interno**, **porta**, **nome da base**, **utilizador** e **palavra-passe** que o Coolify mostra (ou usa variáveis que o Coolify injeta ao ligar serviços).
3. Cria um recurso **Redis** (ex.: Redis 7).
4. Anota **host** e **porta** internos (e password, se existir).

> Em muitos setups o Coolify permite **ligar** a base e o Redis à aplicação e preencher variáveis automaticamente; usa isso sempre que estiver disponível.

---

## Passo 2: Criar a aplicação web (Dockerfile)

1. **Novo recurso** → **Application** (ou equivalente) → escolhe **Dockerfile** / build a partir de Git.
2. Liga o **repositório** e a **branch** (ex.: `main` ou `preview`).
3. Configuração de build (valores típicos):
   - **Base directory**: `/` (raiz do repo).
   - **Dockerfile location**: `Dockerfile`.
   - **Docker build context**: `.` (raiz).
   - **Docker Build Stage**: deixa vazio **ou** define `web` (o último stage do Dockerfile é a imagem web).
4. **Porta exposta pelo container**: **8080** (é a porta em que o Nginx escuta dentro da imagem).
5. **Health check** (se o Coolify pedir caminho): `GET /up` no porto **8080** (a imagem já inclui `HEALTHCHECK` para `/up`).
6. Associa o **domínio** e ativa **HTTPS** (geração automática de certificado, conforme o teu Coolify).

---

## Passo 3: Variáveis de ambiente (aplicação web)

Define pelo menos as seguintes variáveis no painel da aplicação (ajusta valores e hosts aos que o Coolify te der).

| Variável | Exemplo / notas |
|----------|------------------|
| `APP_NAME` | Nome da app |
| `APP_ENV` | `production` |
| `APP_KEY` | Gera com `php artisan key:generate --show` localmente e cola o valor **base64:...** |
| `APP_DEBUG` | `false` |
| `APP_URL` | URL pública com `https://` (ex.: `https://app.teudominio.com`) |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | Host interno do PostgreSQL no Coolify |
| `DB_PORT` | `5432` (ou o que o serviço usar) |
| `DB_DATABASE` | Nome da base |
| `DB_USERNAME` | Utilizador |
| `DB_PASSWORD` | Palavra-passe |
| `REDIS_CLIENT` | `phpredis` |
| `REDIS_HOST` | Host interno do Redis |
| `REDIS_PORT` | `6379` (ou o configurado) |
| `REDIS_PASSWORD` | Se o Redis tiver password |
| `CACHE_STORE` | `redis` |
| `QUEUE_CONNECTION` | `redis` |
| `SESSION_DRIVER` | `database` (requer migrações; ver passo 5) |
| `LOG_CHANNEL` | `stack` ou `stderr` conforme preferires |
| `MAIL_MAILER` | `resend` em produção |
| `RESEND_API_KEY` | Chave da API Resend (segredo) |
| `MAIL_FROM_ADDRESS` | Endereço no domínio verificado na Resend |
| `MAIL_FROM_NAME` | Nome exibido no “From” (ex.: valor de `APP_NAME`) |

**Mail (produção):** usa [Resend](https://resend.com) com o mailer nativo do Laravel — define `MAIL_MAILER=resend`, `RESEND_API_KEY` (segredo no painel) e `MAIL_FROM_ADDRESS` / `MAIL_FROM_NAME` num domínio verificado na Resend. Guia do projeto: [`docs/email-migration.md`](./email-migration.md). Não uses Mailpit nem SMTP de desenvolvimento em produção.

**Sessão e cookies:** em produção com domínio próprio, revê `SESSION_DOMAIN` e `SANCTUM_STATEFUL_DOMAINS` se usares funcionalidades que dependam disso.

O projeto já confia proxies (`TrustProxies`) para funcionar corretamente atrás do reverse proxy do Coolify.

---

## Passo 4: Deploy inicial

1. Guarda as variáveis e faz **Deploy**.
2. Espera o build (Composer, `npm run build` + `build:ssr` dentro da imagem) e o arranque dos processos (Nginx, PHP-FPM, Inertia SSR).

Se o deploy falhar, consulta os **logs de build** e os **logs do container** no Coolify.

---

## Passo 5: Migrações (obrigatório)

Na primeira vez (e após migrações novas), corre migrações **dentro** do container ou com o comando de pós-deploy do Coolify:

```bash
php artisan migrate --force
```

No Coolify, usa **Execute Command**, **Post-deployment script**, ou o equivalente ao teu painel, com o comando acima na **raiz da aplicação** (`/var/www/html` dentro da imagem).

> Com `SESSION_DRIVER=database`, as tabelas de sessão precisam existir; as migrações do Laravel tratam disso se estiveres a usar a configuração padrão.

---

## Passo 6 (opcional): Worker de filas

1. Cria **outra** aplicação Docker a partir do **mesmo** Git e `Dockerfile`.
2. **Docker Build Stage**: `worker` (importante: não uses o stage `web`).
3. **Portas**: o worker não precisa de porta HTTP pública; podes não publicar porta ou ignorar mapeamento HTTP.
4. Copia as **mesmas** variáveis de ambiente da app web (especialmente `APP_KEY`, `DB_*`, `REDIS_*`, `APP_ENV=production`).
5. Se processares email ou notificações na fila, copia também as variáveis de mail da app web: `MAIL_MAILER`, `RESEND_API_KEY`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` (e `MAIL_*` adicionais que a web use). Sem isto, jobs que enviam mail podem falhar no worker.
6. O **comando** por defeito da imagem já é `php artisan queue:work redis ...`; só precisas de fazer deploy se o Coolify não sobrescrever o `CMD`.

Garante que o Redis e a base de dados estão acessíveis a partir deste container (mesma rede / mesmos hosts internos).

---

## Checklist rápido

- [ ] PostgreSQL e Redis criados e acessíveis na rede interna.
- [ ] App web: Dockerfile na raiz, porta **8080**, `APP_KEY` e `APP_URL` corretos.
- [ ] Email (produção): `MAIL_MAILER=resend`, `RESEND_API_KEY`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` na app web.
- [ ] `php artisan migrate --force` executado após o primeiro deploy.
- [ ] (Opcional) App worker com stage **`worker`** e mesmas credenciais (incluindo mail se jobs enviarem email).

## Problemas comuns

- **502 / app não responde:** confirma que a porta publicada no Coolify corresponde à **8080** do container.
- **Erro de base de dados:** verifica `DB_HOST` (hostname interno do serviço no Coolify, não `localhost`).
- **Fila não processa:** confirma o recurso **worker** com stage `worker` e `REDIS_*` corretos.
- **Assets / páginas em branco:** o build frontend corre na imagem; não é necessário `npm run dev` no servidor.

---

Para desenvolvimento local continua a usar [`docker-compose.yml`](../docker-compose.yml) e o [`docker/php/Dockerfile`](../docker/php/Dockerfile); este guia aplica-se apenas ao fluxo de **produção** com o `Dockerfile` da raiz.
