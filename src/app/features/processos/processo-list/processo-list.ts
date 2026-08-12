import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ProcessoService } from '../../../core/processo.service';
import { Processo, STATUS_CLASSE, STATUS_OPCOES, StatusProcesso } from '../../../models/processo.model';
import { AuditoriaInfo } from '../../../shared/auditoria-info/auditoria-info';

@Component({
  selector: 'app-processo-list',
  imports: [
    DatePipe, FormsModule, AuditoriaInfo, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule,
    MatTableModule
  ],
  templateUrl: './processo-list.html',
  styleUrl: './processo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessoList {
  private readonly service = inject(ProcessoService);

  readonly statusOpcoes = STATUS_OPCOES;
  readonly colunas = [
    'numero', 'assunto', 'status', 'dataCriacao', 'partes', 'andamentos', 'alteracao'
  ];

  classeStatus(status: StatusProcesso): string {
    return STATUS_CLASSE[status];
  }

  readonly processos = signal<Processo[]>([]);
  readonly totalItems = signal(0);
  readonly carregando = signal(false);

  page = 0;
  pageSize = 10;
  filtroStatus: StatusProcesso | null = null;
  filtroNumero = '';

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);

    this.service.listar({
      status: this.filtroStatus,
      numero: this.filtroNumero,
      page: this.page + 1,
      pageSize: this.pageSize
    }).subscribe({
      next: resultado => {
        this.processos.set(resultado.items);
        this.totalItems.set(resultado.totalItems);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  aplicarFiltros(): void {
    this.page = 0;
    this.carregar();
  }

  limparFiltros(): void {
    this.filtroStatus = null;
    this.filtroNumero = '';
    this.aplicarFiltros();
  }

  mudarPagina(evento: PageEvent): void {
    this.page = evento.pageIndex;
    this.pageSize = evento.pageSize;
    this.carregar();
  }
}