import { useEffect, useMemo, useState } from "react";

const API_URL = "/api/tarefas";
const filtros = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "pendentes", rotulo: "Pendentes" },
  { valor: "concluidas", rotulo: "Concluídas" },
];

async function requisitar(url, options) {
  const resposta = await fetch(url, options);
  if (resposta.status === 204) return null;

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Não foi possível concluir a operação.");
  }
  return dados;
}

function Tarefa({ tarefa, bloqueada, aoAtualizar, aoExcluir }) {
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(tarefa.titulo);

  async function salvarEdicao(event) {
    event.preventDefault();
    const novoTitulo = titulo.trim();
    if (!novoTitulo || novoTitulo === tarefa.titulo) {
      setTitulo(tarefa.titulo);
      setEditando(false);
      return;
    }
    await aoAtualizar(tarefa.id, { titulo: novoTitulo });
    setEditando(false);
  }

  return (
    <li className={`task ${tarefa.concluida ? "task--done" : ""}`}>
      <label className="task__check">
        <input
          type="checkbox"
          checked={tarefa.concluida}
          disabled={bloqueada || editando}
          onChange={(event) => aoAtualizar(tarefa.id, { concluida: event.target.checked })}
          aria-label={`Marcar ${tarefa.titulo} como ${tarefa.concluida ? "pendente" : "concluída"}`}
        />
      </label>

      {editando ? (
        <form className="task__edit" onSubmit={salvarEdicao}>
          <input
            autoFocus
            maxLength="200"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            aria-label="Editar título da tarefa"
          />
          <button className="button button--small" type="submit" disabled={bloqueada || !titulo.trim()}>
            Salvar
          </button>
          <button
            className="button button--quiet button--small"
            type="button"
            onClick={() => {
              setTitulo(tarefa.titulo);
              setEditando(false);
            }}
          >
            Cancelar
          </button>
        </form>
      ) : (
        <>
          <span className="task__title">{tarefa.titulo}</span>
          <div className="task__actions">
            <button
              className="button button--quiet button--small"
              type="button"
              disabled={bloqueada}
              onClick={() => {
                setTitulo(tarefa.titulo);
                setEditando(true);
              }}
            >
              Editar
            </button>
            <button
              className="button button--danger button--small"
              type="button"
              disabled={bloqueada}
              onClick={() => aoExcluir(tarefa)}
            >
              Excluir
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    requisitar(API_URL, { signal: controller.signal })
      .then(setTarefas)
      .catch((error) => {
        if (error.name !== "AbortError") setErro(error.message);
      })
      .finally(() => setCarregando(false));
    return () => controller.abort();
  }, []);

  const tarefasVisiveis = useMemo(() => tarefas.filter((tarefa) => {
    if (filtro === "pendentes") return !tarefa.concluida;
    if (filtro === "concluidas") return tarefa.concluida;
    return true;
  }), [tarefas, filtro]);

  const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;

  async function executarAcao(acao) {
    setOcupado(true);
    setErro("");
    try {
      await acao();
    } catch (error) {
      setErro(error.message);
    } finally {
      setOcupado(false);
    }
  }

  function adicionarTarefa(event) {
    event.preventDefault();
    const novoTitulo = titulo.trim();
    if (!novoTitulo) return;

    executarAcao(async () => {
      const novaTarefa = await requisitar(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: novoTitulo }),
      });
      setTarefas((atuais) => [...atuais, novaTarefa]);
      setTitulo("");
    });
  }

  function atualizarTarefa(id, alteracoes) {
    return executarAcao(async () => {
      const tarefaAtualizada = await requisitar(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alteracoes),
      });
      setTarefas((atuais) => atuais.map((tarefa) => tarefa.id === id ? tarefaAtualizada : tarefa));
    });
  }

  function excluirTarefa(tarefa) {
    if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) return;
    executarAcao(async () => {
      await requisitar(`${API_URL}/${tarefa.id}`, { method: "DELETE" });
      setTarefas((atuais) => atuais.filter((item) => item.id !== tarefa.id));
    });
  }

  return (
    <main className="page">
      <header className="header">
        <div className="header__icon" aria-hidden="true">✓</div>
        <p className="eyebrow">ORGANIZAÇÃO PESSOAL</p>
        <h1>Minhas tarefas</h1>
        <p className="subtitle">Um passo de cada vez. Você consegue.</p>
      </header>

      <section className="panel" aria-labelledby="task-list-title">
        <form className="add-form" onSubmit={adicionarTarefa}>
          <label className="sr-only" htmlFor="new-task">Nova tarefa</label>
          <input
            id="new-task"
            maxLength="200"
            placeholder="O que você precisa fazer?"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            disabled={ocupado}
          />
          <button className="button button--primary" type="submit" disabled={ocupado || !titulo.trim()}>
            Adicionar
          </button>
        </form>

        {erro && <p className="notice notice--error" role="alert">{erro}</p>}

        <div className="list-heading">
          <div>
            <h2 id="task-list-title">Sua lista</h2>
            <p>{concluidas} de {tarefas.length} concluída(s)</p>
          </div>
          <div className="filters" aria-label="Filtrar tarefas">
            {filtros.map((opcao) => (
              <button
                key={opcao.valor}
                className={`filter ${filtro === opcao.valor ? "filter--active" : ""}`}
                type="button"
                aria-pressed={filtro === opcao.valor}
                onClick={() => setFiltro(opcao.valor)}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
        </div>

        {carregando ? (
          <p className="empty-state">Carregando tarefas…</p>
        ) : tarefasVisiveis.length === 0 ? (
          <p className="empty-state">
            {tarefas.length === 0 ? "Sua lista está vazia. Adicione uma tarefa para começar." : "Nenhuma tarefa neste filtro."}
          </p>
        ) : (
          <ul className="tasks">
            {tarefasVisiveis.map((tarefa) => (
              <Tarefa
                key={tarefa.id}
                tarefa={tarefa}
                bloqueada={ocupado}
                aoAtualizar={atualizarTarefa}
                aoExcluir={excluirTarefa}
              />
            ))}
          </ul>
        )}
      </section>

      <footer className="footer">Seus dados ficam salvos neste computador.</footer>
    </main>
  );
}
