# Sistema de Gestão de Processos — Frontend

Interface web para cadastrar e acompanhar processos, com as partes envolvidas (interessadas e contrárias) e o histórico de andamentos de cada um.

Este repositório tem só o frontend. A API está em [Integrativa-Backend](https://github.com/LucasFerreira2D/Integrativa-Backend) e precisa estar rodando.

## Stack

- Angular 22 (standalone, zoneless)
- Angular Material 22
- TypeScript 6
- RxJS 7

## Como rodar

Você vai precisar do Node 20 ou superior e da API rodando em `http://localhost:5122`.

Clone o projeto e instale as dependências:

```bash
git clone https://github.com/LucasFerreira2D/Integrativa-Frontend.git
cd Integrativa-Frontend
npm install
```

Suba o dev server:

```bash
npm start
```

A aplicação abre em `http://localhost:4200` e redireciona para `/processos`.

Não há configuração de ambiente para preencher: o `ProcessoService` chama caminhos relativos (`/api/processos`) e o `proxy.conf.json` encaminha tudo que começa com `/api` para `http://localhost:5122`. Se a API subir em outra porta, é esse arquivo que muda.

Como o proxy repassa as requisições pelo próprio dev server, o browser vê tudo na mesma origem e não há preflight — por isso a API não precisa de CORS em desenvolvimento. Em produção o mesmo host deve servir o `dist/` e a API sob `/api`; servindo em origens diferentes, aí sim o backend precisa liberar CORS.

Para gerar o bundle de produção:

```bash
npm run build
```

A saída vai para `dist/integrativa-frontend`.

## Organização do código

Tudo fica sob `src/app`:

- **core**: o `ProcessoService`, que concentra as chamadas HTTP, o interceptor de erro e os rótulos em português do paginador.
- **models**: as interfaces que espelham os DTOs da API, mais as constantes de status e tipo de parte usadas na UI.
- **shared**: componentes reaproveitados entre telas (`AuditoriaInfo`, `ConfirmDialog`) e as configurações padrão de diálogo.
- **features/processos**: a listagem, a tela de detalhes e os diálogos de formulário, partes e andamentos.

As duas telas são carregadas com `loadComponent`, então cada uma vira um chunk separado do bundle inicial.

O `ProcessoService` é a única coisa que sabe o formato da API. Os componentes recebem e devolvem os tipos de `models` e nunca montam URL.

## Decisões

Não há nenhum `NgModule`. Todo componente é standalone e declara os próprios `imports`; o que era `SharedModule` virou import direto e o que era `FeatureModule` virou arquivo de rotas.

A aplicação roda **zoneless** (`provideZonelessChangeDetection()`), que é o padrão do Angular 22 — o `zone.js` não está instalado. Estado que a tela precisa enxergar mora em `signal`, e todo componente usa `ChangeDetectionStrategy.OnPush`. Na prática isso significa que mutar um campo comum dentro de um callback assíncrono não redesenha nada: ou o valor é um signal, ou a mudança vem de um evento do template.

O `@angular/animations` também não está instalado. Está depreciado desde a v20.2 e o Material 22 não depende mais dele — as animações são CSS nativo.

Os arquivos seguem a convenção do CLI a partir da v20: sem o sufixo `.component`, e a classe com o mesmo nome do arquivo (`processo-list.ts` → `ProcessoList`).

Não existe `src/environments`. Com um único ambiente e caminho relativo, seria uma indireção para uma constante só.

Roboto e Material Icons vêm do Google Fonts, declaradas no `index.html`. Sem elas o `mat-icon` renderiza o nome da ligature como texto cru e o `mat.theme()` cai na fonte serifada do browser.

## Telas

São duas rotas.

**`/processos`** é a listagem: filtro por número (busca parcial) e por status, paginação servida pelo backend, contadores de partes e andamentos e uma coluna de última alteração com usuário e data. Cada linha leva para os detalhes e traz atalhos para editar, excluir e abrir os diálogos de partes e andamentos.

**`/processos/:id`** é a tela de detalhes: o cabeçalho com número e status, o resumo com assunto e datas, a lista de partes e os andamentos em ordem cronológica, do mais recente para o mais antigo.

Quatro diálogos são usados a partir das duas:

- **formulário de processo**, o mesmo para criar e editar — recebe um `id` opcional e decide pelo que veio;
- **partes**, para vincular e remover partes do processo;
- **andamentos**, com datepicker para registrar a data do movimento;
- **confirmação**, exigida antes de qualquer exclusão.

Os diálogos de partes e andamentos devolvem um booleano dizendo se algo mudou, e a tela que os abriu só recarrega quando ele é verdadeiro — assim os contadores ficam certos sem uma requisição a cada fechamento.

Erro de API não aparece no console: o `errorInterceptor` lê o `ProblemDetails` da resposta e mostra a mensagem num snackbar, inclusive os erros de validação campo a campo.

## Responsividade

A tabela da listagem não rola na horizontal. Conforme a tela estreita, as colunas menos essenciais somem: última alteração abaixo de 1100px; criado em, partes e andamentos abaixo de 840px; status abaixo de 600px, quando número e assunto passam a quebrar linha. Número, assunto e as ações ficam sempre visíveis.

Como os atalhos de partes e andamentos saem da tabela nas telas estreitas, é pela tela de detalhes que se chega a eles no celular. Diálogos e formulários quebram em uma coluna abaixo de 600px.

## O que ficou de fora

- Testes automatizados.
- Autenticação. A API preenche `UsuarioAlteracao` com `"Sistema"` fixo, e a interface só exibe esse campo.
- Um shell da aplicação. Não há cabeçalho nem navegação: a rota raiz vai direto para a listagem.
- Dockerfile.
