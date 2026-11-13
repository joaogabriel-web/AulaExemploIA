# AulaExemploIA

## Aplicação de tarefas

Aplicação de exemplo com frontend em React/Vite e API REST em Express. As tarefas são salvas localmente em `data/tasks.json`, criado automaticamente na primeira execução.

### Executar em desenvolvimento

Requer Node.js 20.19 ou mais recente.

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite (normalmente `http://127.0.0.1:5173`). O Vite encaminha as chamadas `/api` para o backend Express em `http://localhost:3000`.

### Executar versão de produção

```bash
npm run build
npm start
```

Abra `http://localhost:3000`.

### Rotas da API

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/api/tarefas` | Lista tarefas |
| `POST` | `/api/tarefas` | Cria uma tarefa (`{ "titulo": "..." }`) |
| `PATCH` | `/api/tarefas/:id` | Atualiza título e/ou conclusão |
| `DELETE` | `/api/tarefas/:id` | Exclui uma tarefa |