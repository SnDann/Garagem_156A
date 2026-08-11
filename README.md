# 🚗 Garagem 156A - Manual de Entrega do Projeto

Este repositório contém a solução completa para o sistema de gestão **Garagem 156A**, englobando Backend em Python (Flask + SQLAlchemy) e Frontend em React.js.

> Para instruções rápidas de deploy web com Render e Vercel, consulte `DEPLOYMENT.md`.

---

## 📋 Estado do Projeto

- **Backend API**: 100% Funcional e Validado.
- **Frontend React**: 100% Funcional, Compilado e Integrado.
- **Suíte de Testes**: 100% dos testes passando (`5/5` em Pytest).
- **Build de Produção**: Gerado e verificado sem erros (`npm run build`).

---

## 🛠️ Como Executar o Projeto

### 1. Iniciar o Backend (Flask API)
```bash
# Navegar até a pasta do backend
cd Backend

# Instalar dependências (caso necessário)
pip install -r requirements.txt

# Executar a aplicação
python app.py
```
A API estará acessível em: `http://localhost:5000`  
Health check disponível em: `http://localhost:5000/health`

### 2. Iniciar o Frontend (React)
```bash
# Navegar até a pasta do frontend
cd Frontend

# Instalar dependências (caso necessário)
npm install

# Iniciar o servidor de desenvolvimento
npm start
```
O Dashboard abrirá automaticamente em: `http://localhost:3000`

---

## 🧪 Como Executar os Testes Automatizados

Para validar a integridade de todas as rotas e regras de negócio:

```bash
python -m pytest Backend/tests
```

---

## 📁 Estrutura de Rotas e Endpoints

### Backend API (`http://localhost:5000/api`)
- `GET /health` - Health Check da API
- `POST /api/auth/login` - Autenticação de usuários
- `GET /api/clientes` & `POST /api/clientes` - Gestão de clientes
- `GET /api/miniaturas` & `POST /api/miniaturas` - Catálogo e estoque de miniaturas
- `GET /api/pedidos` & `POST /api/pedidos` - Gestão de pedidos e vendas
- `GET /api/dashboard/stats` - Métricas para o Dashboard
- `GET /api/gastos` - Módulo de controle de gastos

### Frontend Pages (`http://localhost:3000`)
- `/` ou `/dashboard` - Painel Principal e Métricas
- `/clientes` - Lista e Cadastro de Clientes
- `/miniaturas` - Gestão de Miniaturas e Estoque
- `/pedidos` - Controle de Pedidos

---


O fluxo recomendado é publicar como webapp:

- Hospedar o **Frontend** (React) no Vercel como um site estático.
- Hospedar o **Backend** (Flask) em um serviço PaaS (Render, Railway, Fly, Azure App Service, etc.) com um banco Postgres gerenciado.

Passos rápidos para o Frontend (Vercel):

1. Garanta que o repositório esteja no GitHub.
2. No painel do Vercel, clique em **Import Project** e selecione a pasta `Frontend` deste repositório.
3. Em **Build Settings** use: `npm run build` como *Build Command* e `build` como *Output Directory*.
4. Nas *Environment Variables* do projeto, adicione:
	 - `REACT_APP_API_URL` = `https://<sua-api>.example.com` (a URL pública do backend)
5. Deploy.

Observações:
- O código do frontend já usa `REACT_APP_API_URL` em `Frontend/src/services/api.js` como base para requisições; por padrão local ele usa `http://localhost:5000`.
- Se preferir evitar CORS, você pode usar uma `vercel.json` com *rewrites* apontando `/api/*` para sua API externa, mas o método mais simples é configurar `REACT_APP_API_URL` no dashboard.

Exemplo mínimo `vercel.json` (já incluído em `Frontend/vercel.json`):

```
{
	"version": 2,
	"builds": [
		{ "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "build" } }
	],
	"routes": [ { "src": "/(.*)", "dest": "/index.html" } ]
}
```

Backend recomendação rápida:

- Mude do SQLite para Postgres em produção e exponha `DATABASE_URL` como variável de ambiente.
- Configure `SECRET_KEY` e outras variáveis sensíveis no serviço (não commitá-las).
- Use `gunicorn` ou `waitress` para servir a app em produção (ex.: `gunicorn app:app --bind 0.0.0.0:$PORT`).

Quer que eu gere um `render.yaml` ou scripts de migração para Postgres agora? Posso implementar a migração (opção B) quando você autorizar.

### Deploy Backend no Render (resumo)

1. Crie um repositório Git (ou use o existente) e push do projeto.
2. No painel do Render, clique em **New** → **Web Service**, conecte ao repositório e selecione a pasta raiz do projeto (o `render.yaml` acima também pode automatizar a criação).
3. Configure `Environment` como `Python`, `Build Command` como `pip install -r Backend/requirements.txt` e `Start Command` como `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`.
4. Crie um banco de dados PostgreSQL gerenciado no Render e copie a `DATABASE_URL` para as variáveis de ambiente do serviço (ou use o `render.yaml` para vinculá-lo automaticamente).
5. Rode migrações (ex.: via `alembic upgrade head`) apontando `DATABASE_URL` para o banco Postgres.

Arquivos adicionados para ajudar:
- `Backend/render.yaml` — manifest para criar serviço + banco Postgres no Render (preencha `repo` e `branch`).
- `Backend/migrations/` — ambiente Alembic pronto para gerar e aplicar revisões.
- `Backend/scripts/migrate_postgres.sh` / `migrate_postgres.ps1` — helpers para executar as migrações.

Se quiser, eu executo agora as etapas para criar a primeira migração `alembic revision --autogenerate` e commito o resultado (isso exige que `alembic` esteja instalado no venv). Deseja que eu crie a migração inicial automaticamente? 



