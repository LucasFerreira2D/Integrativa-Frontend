export type StatusProcesso = 'Ativo' | 'Finalizado' | 'Arquivado';
export type TipoParte = 'Interessada' | 'Contraria';

export const STATUS_OPCOES: StatusProcesso[] = ['Ativo', 'Finalizado', 'Arquivado'];
export const TIPO_PARTE_OPCOES: TipoParte[] = ['Interessada', 'Contraria'];

export const TIPO_PARTE_ROTULO: Record<TipoParte, string> = {
  Interessada: 'Parte Interessada',
  Contraria: 'Parte Contrária'
};

export const STATUS_CLASSE: Record<StatusProcesso, string> = {
  Ativo: 'status--ativo',
  Finalizado: 'status--finalizado',
  Arquivado: 'status--arquivado'
};

export interface Auditoria {
  dataAlteracao: string;
  usuarioAlteracao: string;
}

export interface Processo extends Auditoria {
  id: string;
  numero: string;
  assunto: string;
  dataCriacao: string;
  status: StatusProcesso;
  totalPartes: number;
  totalAndamentos: number;
}

export interface Parte extends Auditoria {
  id: string;
  nome: string;
  tipo: TipoParte;
}

export interface Andamento extends Auditoria {
  id: string;
  data: string;
  descricao: string;
}

export interface ProcessoDetalhe extends Auditoria {
  id: string;
  numero: string;
  assunto: string;
  dataCriacao: string;
  status: StatusProcesso;
  partes: Parte[];
  andamentos: Andamento[];
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ProcessoFiltro {
  status?: StatusProcesso | null;
  numero?: string | null;
  page: number;
  pageSize: number;
}

export interface ProcessoPayload {
  numero: string;
  assunto: string;
  status: StatusProcesso;
}
