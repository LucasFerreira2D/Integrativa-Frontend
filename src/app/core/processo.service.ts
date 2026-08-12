import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Andamento, PagedResult, Parte, Processo, ProcessoDetalhe, ProcessoFiltro,
  ProcessoPayload, TipoParte
} from '../models/processo.model';

@Injectable({ providedIn: 'root' })
export class ProcessoService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api/processos';

  listar(filtro: ProcessoFiltro): Observable<PagedResult<Processo>> {
    let params = new HttpParams()
      .set('page', filtro.page)
      .set('pageSize', filtro.pageSize);

    if (filtro.status) params = params.set('status', filtro.status);
    if (filtro.numero?.trim()) params = params.set('numero', filtro.numero.trim());

    return this.http.get<PagedResult<Processo>>(this.baseUrl, { params });
  }

  obter(id: string): Observable<ProcessoDetalhe> {
    return this.http.get<ProcessoDetalhe>(`${this.baseUrl}/${id}`);
  }

  criar(payload: ProcessoPayload): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.baseUrl, payload);
  }

  atualizar(id: string, payload: ProcessoPayload): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  adicionarParte(processoId: string, nome: string, tipo: TipoParte): Observable<Parte> {
    return this.http.post<Parte>(`${this.baseUrl}/${processoId}/partes`, { nome, tipo });
  }

  removerParte(processoId: string, parteId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${processoId}/partes/${parteId}`);
  }

  adicionarAndamento(processoId: string, data: string, descricao: string): Observable<Andamento> {
    return this.http.post<Andamento>(`${this.baseUrl}/${processoId}/andamentos`, { data, descricao });
  }

  removerAndamento(processoId: string, andamentoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${processoId}/andamentos/${andamentoId}`);
  }
}