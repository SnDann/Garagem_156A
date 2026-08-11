# Deploy Web - Garagem 156A

Este documento descreve o fluxo mínimo para publicar o backend e o frontend como aplicações web.

## 1. Backend no Render

### Configuração do projeto
- Conecte seu repositório GitHub ao Render.
- Importe o serviço usando `Backend/render.yaml`.
- Selecione a branch `main`.

### Variáveis de ambiente obrigatórias
- `DATABASE_URL` = URL do banco Postgres gerenciado pela Render.
- `SECRET_KEY` = valor seguro para sessão/CRSF.

### Comandos
- Build Command: `pip install -r Backend/requirements.txt`
- Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

### Banco de dados
- Crie um banco Postgres gerenciado no Render.
- Conecte o banco ao serviço ou copie a `DATABASE_URL` para as variáveis do serviço.

### Migração
Após deploy inicial, execute:
```bash
cd Backend
.
venv\Scripts\python.exe -m alembic upgrade head
```
ou use o terminal do Render com `DATABASE_URL` configurado.

## 2. Frontend no Vercel

### Configuração do projeto
- Importe a pasta `Frontend` como um novo projeto Vercel.
- Build Command: `npm run build`
- Output Directory: `build`

### Variáveis de ambiente
- `REACT_APP_API_URL` = URL pública do backend no Render.

### Deploy
- Execute o deploy no Vercel.
- O site estático consumirá a API via `REACT_APP_API_URL`.

## 3. Teste de integração final

1. Acesse o frontend no domínio Vercel gerado.
2. Verifique se as chamadas API chegam ao backend.
3. Teste o health check do backend:
   - `https://<backend-url>/health`
4. Teste a navegação e ações principais no frontend.

## 4. Observações

- Em local, o frontend usa `http://localhost:5000` por padrão.
- Em produção, configure `REACT_APP_API_URL` para a URL do backend.
- Caso queira usar um banco externo, basta atualizar `DATABASE_URL`.
