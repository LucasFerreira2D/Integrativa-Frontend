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
- **features/processos**: a listagem e os quatro diálogos — formulário de processo, partes e andamentos.

A rota `/processos` carrega a listagem com `loadComponent`, então a tela e todo o Material que ela usa ficam num chunk separado do bundle inicial.

O `ProcessoService` é a única coisa que sabe o formato da API. Os componentes recebem e devolvem os tipos de `models` e nunca montam URL.

## Decisões

Não há nenhum `NgModule`. Todo componente é standalone e declara os próprios `imports`; o que era `SharedModule` virou import direto e o que era `FeatureModule` virou arquivo de rotas.

A aplicação roda **zoneless** (`provideZonelessChangeDetection()`), que é o padrão do Angular 22 — o `zone.js` não está instalado. Estado que a tela precisa enxergar mora em `signal`, e todo componente usa `ChangeDetectionStrategy.OnPush`. Na prática isso significa que mutar um campo comum dentro de um callback assíncrono não redesenha nada: ou o valor é um signal, ou a mudança vem de um evento do template.

O `@angular/animations` também não está instalado. Está depreciado desde a v20.2 e o Material 22 não depende mais dele — as animações são CSS nativo.

Os arquivos seguem a convenção do CLI a partir da v20: sem o sufixo `.component`, e a classe com o mesmo nome do arquivo (`processo-list.ts` → `ProcessoList`).

Não existe `src/environments`. Com um único ambiente e caminho relativo, seria uma indireção para uma constante só.

Roboto e Material Icons vêm do Google Fonts, declaradas no `index.html`. Sem elas o `mat-icon` renderiza o nome da ligature como texto cru e o `mat.theme()` cai na fonte serifada do browser.

## Telas

A listagem tem filtro por número (busca parcial) e por status, paginação servida pelo backend e uma coluna de última alteração com usuário e data.

Cada linha abre quatro diálogos:

- **formulário de processo**, o mesmo para criar e editar — recebe um `id` opcional e decide pelo que veio;
- **partes**, para vincular e remover partes do processo;
- **andamentos**, com datepicker e a timeline do mais recente para o mais antigo;
- **confirmação**, exigida antes de qualquer exclusão.

Os diálogos de partes e andamentos devolvem um booleano dizendo se algo mudou, e a listagem só recarrega quando ele é verdadeiro — assim os contadores das colunas ficam certos sem uma requisição a cada fechamento.

Erro de API não aparece no console: o `errorInterceptor` lê o `ProblemDetails` da resposta e mostra a mensagem num snackbar, inclusive os erros de validação campo a campo.

## O que ficou de fora

- Testes. Os `.spec.ts` são os que o CLI gerou e não foram ajustados; `npm test` falha nos diálogos, que hoje exigem `MatDialogRef` no `TestBed`.
- Autenticação. A API preenche `UsuarioAlteracao` com `"Sistema"` fixo, e a interface só exibe esse campo.
- Layout responsivo além do básico. Os diálogos e o formulário quebram em uma coluna abaixo de 600px, mas a tabela apenas ganha rolagem horizontal.
- Dockerfile.
