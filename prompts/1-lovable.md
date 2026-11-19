Crie somente o front-end de um MVP de lista de tarefas usando Vue.js, JavaScript, HTML semântico e CSS responsivo. Atue como um programador pleno com forte experiência em engenharia de software e cibersegurança, priorizando simplicidade, legibilidade, manutenção, validação de entradas e comportamentos seguros.

Não crie autenticação, back-end, API, banco de dados, serviços em nuvem, telemetria ou integrações externas. A aplicação deve funcionar offline depois de carregada. Use somente dados simulados e localStorage para persistência local no navegador. Identifique claramente no código e na interface inicial que os dados de demonstração são simulados.

# Objetivo

Desenvolver uma interface simples, responsiva e acessível para uma pessoa que deseja organizar tarefas pessoais e sua rotina diária sem precisar criar uma conta.

Problema do usuário:
- O usuário precisa registrar rapidamente suas tarefas.
- Precisa saber o que está pendente, em andamento ou concluído.
- Precisa localizar tarefas usando busca e filtros.
- Precisa adaptar alguns aspectos visuais da interface às suas preferências.
- Precisa continuar usando a lista sem conexão com a internet.

Resultado esperado:
- Uma lista de tarefas funcional no front-end.
- Criação, edição, alteração de status e exclusão de tarefas.
- Busca, filtros e ordenação.
- Preferências visuais básicas.
- Persistência exclusivamente local.
- Testes dos comportamentos principais, caso o ambiente ofereça suporte.

Use a seguinte paleta:
- #03071e
- #370617
- #6a040f
- #9d0208
- #d00000
- #dc2f02
- #e85d04
- #f48c06
- #faa307
- #ffba08

Aplique a paleta com contraste acessível. Use #03071e como cor estrutural e de textos escuros. Reserve tons vermelhos para erros, ações destrutivas e alertas. Use laranja e amarelo para destaques, foco e ações primárias. Não dependa apenas de cores para transmitir significado.

# Páginas

Crie uma SPA com uma página principal e painéis ou modais internos, sem rotas adicionais desnecessárias.

Página principal:
- Cabeçalho com o nome "Minha Rotina".
- Texto curto explicando que os dados ficam somente neste dispositivo.
- Indicador visível "Demonstração com dados simulados" enquanto os dados iniciais de exemplo estiverem sendo usados.
- Resumo com totais de tarefas pendentes, em andamento e concluídas.
- Formulário para adicionar uma tarefa.
- Barra de busca.
- Filtros por status.
- Controle de ordenação.
- Lista de tarefas.
- Estado vazio.
- Acesso ao painel de personalização.

Formulário de tarefa:
- Título obrigatório.
- Descrição opcional.
- Status: Pendente, Em andamento ou Concluída.
- Prioridade: Baixa, Média ou Alta.
- Data opcional.
- Botões "Salvar tarefa" e "Cancelar" quando estiver editando.
- O mesmo formulário pode ser usado para criar e editar, desde que o modo atual fique evidente.

Painel de personalização:
- Alternância entre tema claro e tema escuro.
- Escolha da cor de destaque entre opções derivadas da paleta fornecida.
- Densidade confortável ou compacta.
- Preferência de ordenação padrão.
- Botão para restaurar preferências.
- Salvar as preferências no localStorage.

Inclua inicialmente entre 4 e 6 tarefas de demonstração. Marque esses registros no código como MOCK_DATA e exiba um aviso discreto de que são dados simulados.

# Comportamentos

Fluxo principal:
1. Ao abrir a aplicação pela primeira vez, carregar dados simulados.
2. Exibir brevemente um estado de carregamento local.
3. Permitir que o usuário digite o título e os demais dados da tarefa.
4. Validar o título.
5. Ao salvar com sucesso, inserir a tarefa na lista e persistir no localStorage.
6. Permitir editar a tarefa.
7. Permitir mudar o status diretamente no cartão ou item da lista.
8. Permitir excluir com confirmação.
9. Depois da exclusão, exibir uma mensagem com ação "Desfazer".
10. Atualizar contadores, busca e filtros imediatamente.

Busca e filtros:
- Buscar pelo título e pela descrição.
- Filtrar por Todos, Pendentes, Em andamento e Concluídas.
- Permitir ordenar por data de criação, data da tarefa, prioridade ou título.
- Mostrar a quantidade de resultados.
- Exibir uma ação para limpar busca e filtros.
- Filtros, busca e ordenação devem funcionar apenas no front-end.

Estados da interface:
- Campo obrigatório vazio: borda vermelha, ícone de alerta e mensagem textual em vermelho associada ao campo.
- Carregamento: indicador azul com texto "Carregando dados locais...".
- Erro: mensagem em vermelho, com linguagem simples e indicação de como corrigir.
- Sucesso: borda verde no campo relacionado e mensagem de confirmação em região ARIA apropriada.
- Status: texto em #03071e ou outro tom quase preto com contraste suficiente, acompanhado de rótulo e ícone; não representar status apenas pela cor.
- Lista vazia: ilustração simples feita com CSS ou ícone local, mensagem explicativa e chamada para criar a primeira tarefa.
- Nenhum resultado: informar que os filtros não encontraram tarefas e oferecer a ação "Limpar filtros".
- Exclusão: diálogo de confirmação com foco controlado.
- localStorage indisponível ou cheio: mostrar mensagem clara e manter os dados em memória durante a sessão, sem simular que foram persistidos.

Validações e segurança:
- Remover espaços desnecessários do início e do fim.
- Impedir título vazio.
- Definir limites razoáveis: 100 caracteres para o título e 500 para a descrição.
- Mostrar contador de caracteres.
- Renderizar todo texto do usuário como conteúdo textual, nunca como HTML.
- Não utilizar v-html para dados inseridos pelo usuário.
- Não executar scripts ou conteúdo fornecido nos campos.
- Não incluir segredos, chaves, tokens ou credenciais.
- Confirmar ações destrutivas.
- Tratar falhas de leitura e gravação no localStorage.

Responsividade:
- Mobile-first.
- Em telas pequenas, usar uma única coluna, formulário e filtros empilhados e botões com área de toque confortável.
- Em tablets, permitir duas colunas quando houver espaço.
- Em desktop, usar largura máxima legível e separar formulário/resumo da lista sem comprometer a leitura.
- Evitar rolagem horizontal a partir de 320 px de largura.
- Modais devem caber na tela e permitir rolagem interna.
- Manter ações principais facilmente acessíveis no celular.

Acessibilidade:
- Usar HTML semântico: header, main, section, form, fieldset, label, ul e li quando apropriado.
- Todos os campos devem ter labels visíveis.
- Garantir navegação completa por teclado.
- Usar foco visível e com contraste adequado.
- Manter ordem de foco lógica.
- Usar aria-live para mensagens de sucesso, erro e atualização da lista.
- Usar aria-describedby para associar mensagens de validação aos campos.
- Diálogos devem ter título, descrição, foco inicial, retenção de foco e retorno do foco ao elemento que os abriu.
- Botões com ícones devem ter nome acessível.
- Respeitar prefers-reduced-motion.
- Evitar animações longas ou piscantes.
- Garantir contraste compatível com WCAG 2.1 AA.
- Não usar somente cor, posição ou ícone para comunicar estado.

Componentes Vue sugeridos:
- AppHeader
- TaskSummary
- TaskForm
- TaskToolbar
- SearchField
- StatusFilters
- SortControl
- TaskList
- TaskItem
- EmptyState
- CustomizationPanel
- ConfirmDialog
- ToastMessage
- LoadingState

Organize o código em componentes reutilizáveis. Centralize o gerenciamento de tarefas e preferências em composables ou em estado reativo simples, sem adicionar bibliotecas desnecessárias.

Testes:
- Se o ambiente permitir, use Vitest e Vue Test Utils.
- Testar criação de tarefa válida.
- Testar bloqueio de título vazio.
- Testar edição.
- Testar alteração de status.
- Testar busca e filtros.
- Testar exclusão, confirmação e desfazer.
- Testar leitura e gravação no localStorage.
- Testar fallback quando o localStorage falhar.
- Testar nomes acessíveis dos controles principais.
- Não criar testes de back-end ou integração externa.

# Limites

Inclua somente o front-end deste MVP.

Não implementar:
- Login, cadastro ou recuperação de senha.
- Perfis de usuário.
- Autenticação ou autorização.
- Back-end ou API.
- Banco de dados local ou remoto.
- Firebase, Supabase ou serviços equivalentes.
- Sincronização entre dispositivos.
- Colaboração ou compartilhamento.
- E-mail, notificações push ou SMS.
- Calendários externos.
- Analytics, anúncios ou telemetria.
- Upload de arquivos.
- Inteligência artificial.
- Pagamentos.
- Integrações externas.
- Recursos que dependam de conexão com a internet.
- Service worker complexo ou sincronização em segundo plano, salvo o mínimo já fornecido automaticamente pelo ambiente para carregar a aplicação offline.
- TypeScript, a menos que o ambiente não permita criar o projeto Vue sem ele.

Não adicione funcionalidades fora deste escopo. Não use conteúdo remoto para ícones, fontes ou imagens. Prefira ícones locais, SVGs próprios e fontes do sistema.

# Critérios de aceitação visual

- A tela deve parecer simples, organizada e pronta para um MVP, sem excesso de elementos decorativos.
- A hierarquia deve deixar evidentes o título, o formulário, os filtros e a lista.
- A paleta fornecida deve aparecer de forma equilibrada, sem transformar toda a interface em vermelho.
- O texto principal deve ter contraste forte e legibilidade.
- A ação primária deve ser fácil de identificar.
- Ações destrutivas devem usar vermelho e exigir confirmação.
- Os estados de erro, carregamento, sucesso, vazio e ausência de resultados devem possuir representações visuais distintas e mensagens textuais.
- O foco de teclado deve ser sempre visível.
- O layout deve funcionar sem rolagem horizontal em larguras de 320 px, 768 px e 1440 px.
- Os botões e campos devem ter dimensões confortáveis para toque.
- Títulos longos, descrições longas e listas extensas não podem quebrar o layout.
- Tema claro e tema escuro devem preservar contraste e legibilidade.
- A densidade compacta deve reduzir espaçamentos sem prejudicar a acessibilidade.
- A interface não deve aparentar possuir sincronização, conta ou armazenamento remoto.
- Deve existir indicação clara de que os dados são locais e de que os registros iniciais são simulados.
- Todos os fluxos principais devem ser utilizáveis somente com teclado.
- O resultado deve conter o código completo do front-end e, quando suportado, os testes automatizados correspondentes.
