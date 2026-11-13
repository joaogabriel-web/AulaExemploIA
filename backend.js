import express from "express";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const dataDirectory = path.join(__dirname, "data");
const dataFile = path.join(dataDirectory, "tasks.json");
const starterFile = path.join(dataDirectory, "tasks.example.json");
const builtFrontend = path.join(__dirname, "dist");

await mkdir(dataDirectory, { recursive: true });

try {
  await readFile(dataFile);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  await writeFile(dataFile, await readFile(starterFile), { flag: "wx" });
}

let tasks = JSON.parse(await readFile(dataFile, "utf8"));
if (!Array.isArray(tasks)) {
  throw new Error("data/tasks.json precisa conter uma lista de tarefas.");
}

let mutationQueue = Promise.resolve();

async function saveTasks(nextTasks) {
  const temporaryFile = `${dataFile}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryFile, JSON.stringify(nextTasks, null, 2), "utf8");
    await rename(temporaryFile, dataFile);
  } finally {
    await rm(temporaryFile, { force: true });
  }
}

function mutateTasks(change) {
  const operation = mutationQueue.then(async () => {
    const { nextTasks, result } = change(tasks);
    await saveTasks(nextTasks);
    tasks = nextTasks;
    return result;
  });
  mutationQueue = operation.catch(() => {});
  return operation;
}

function validateTitle(value) {
  if (typeof value !== "string") return null;
  const title = value.trim();
  return title.length > 0 && title.length <= 200 ? title : null;
}

app.use(express.json({ limit: "10kb" }));

app.get("/api/tarefas", (_req, res) => {
  res.json(tasks);
});

app.post("/api/tarefas", async (req, res) => {
  const titulo = validateTitle(req.body?.titulo);
  if (!titulo) {
    return res.status(400).json({ erro: "Informe um título de 1 a 200 caracteres." });
  }

  const tarefa = {
    id: randomUUID(),
    titulo,
    concluida: false,
    criadaEm: new Date().toISOString(),
  };
  await mutateTasks((current) => ({
    nextTasks: [...current, tarefa],
    result: tarefa,
  }));
  res.status(201).json(tarefa);
});

app.patch("/api/tarefas/:id", async (req, res) => {
  const atual = tasks.find((task) => task.id === req.params.id);
  if (!atual) return res.status(404).json({ erro: "Tarefa não encontrada." });

  const body = req.body ?? {};
  const alteracoes = {};
  if (Object.hasOwn(body, "titulo")) {
    const titulo = validateTitle(body.titulo);
    if (!titulo) {
      return res.status(400).json({ erro: "O título deve ter de 1 a 200 caracteres." });
    }
    alteracoes.titulo = titulo;
  }
  if (Object.hasOwn(body, "concluida")) {
    if (typeof body.concluida !== "boolean") {
      return res.status(400).json({ erro: "O campo concluida deve ser verdadeiro ou falso." });
    }
    alteracoes.concluida = body.concluida;
  }
  if (Object.keys(alteracoes).length === 0) {
    return res.status(400).json({ erro: "Envie titulo e/ou concluida para atualizar." });
  }

  const atualizada = { ...atual, ...alteracoes };
  await mutateTasks((current) => ({
    nextTasks: current.map((task) => task.id === atualizada.id ? atualizada : task),
    result: atualizada,
  }));
  res.json(atualizada);
});

app.delete("/api/tarefas/:id", async (req, res) => {
  if (!tasks.some((task) => task.id === req.params.id)) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  await mutateTasks((current) => ({
    nextTasks: current.filter((task) => task.id !== req.params.id),
    result: undefined,
  }));
  res.status(204).end();
});

app.use(express.static(builtFrontend));

app.use((error, _req, res, _next) => {
  console.error("Erro ao processar requisição:", error);
  if (error instanceof SyntaxError && Object.hasOwn(error, "body")) {
    return res.status(400).json({ erro: "O corpo da requisição não contém JSON válido." });
  }
  res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`API disponível em http://localhost:${PORT}`);
  console.log(`Tarefas: http://localhost:${PORT}/api/tarefas`);
});
