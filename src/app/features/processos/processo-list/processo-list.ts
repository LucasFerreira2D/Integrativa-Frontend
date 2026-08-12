import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProcessoService } from '../../../core/processo.service';
import { Processo, STATUS_CLASSE, STATUS_OPCOES, StatusProcesso } from '../../../models/processo.model';
import { AuditoriaInfo } from '../../../shared/auditoria-info/auditoria-info';
import { ConfirmDialog, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog';
import { DIALOG_CONFIRMACAO, DIALOG_LISTA, DIALOG_PADRAO } from '../../../shared/dialog-config';
import { AndamentoDialog, AndamentoDialogData } from '../andamento-dialog/andamento-dialog';
import { ParteDialog, ParteDialogData } from '../parte-dialog/parte-dialog';
import {
  ProcessoFormDialog, ProcessoFormDialogData
} from '../processo-form-dialog/processo-form-dialog';

@Component({
  selector: 'app-processo-list',
  imports: [
    DatePipe, FormsModule, AuditoriaInfo, MatButtonModule, MatDialogModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule,
    MatProgressBarModule, MatSelectModule, MatTableModule, MatTooltipModule
  ],
  templateUrl: './processo-list.html',
  styleUrl: './processo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessoList {
  private readonly service = inject(ProcessoService);
  private readonly dialog = inject(MatDialog);

  readonly statusOpcoes = STATUS_OPCOES;
  readonly colunas = [
    'numero', 'assunto', 'status', 'dataCriacao', 'partes', 'andamentos', 'alteracao', 'acoes'
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

  novoProcesso(): void {
    this.abrirFormulario({});
  }

  gerenciarPartes(processo: Processo): void {
    const data: ParteDialogData = { processoId: processo.id, numero: processo.numero };

    this.dialog.open(ParteDialog, { ...DIALOG_LISTA, data, disableClose: true })
      .afterClosed()
      .subscribe(alterou => {
        if (alterou) this.carregar();
      });
  }

  verAndamentos(processo: Processo): void {
    const data: AndamentoDialogData = { processoId: processo.id, numero: processo.numero };

    this.dialog.open(AndamentoDialog, { ...DIALOG_LISTA, data, disableClose: true })
      .afterClosed()
      .subscribe(alterou => {
        if (alterou) this.carregar();
      });
  }

  editar(processo: Processo): void {
    this.abrirFormulario({ id: processo.id });
  }

  excluir(processo: Processo): void {
    const data: ConfirmDialogData = {
      titulo: 'Excluir processo',
      mensagem: `Excluir o processo ${processo.numero}? Partes e andamentos serão removidos junto.`,
      confirmar: 'Excluir',
      perigo: true
    };

    this.dialog.open(ConfirmDialog, { ...DIALOG_CONFIRMACAO, data })
      .afterClosed()
      .subscribe(confirmado => {
        if (!confirmado) return;

        this.service.excluir(processo.id).subscribe(() => {
          if (this.processos().length === 1 && this.page > 0) {
            this.page--;
          }
          this.carregar();
        });
      });
  }

  private abrirFormulario(data: ProcessoFormDialogData): void {
    this.dialog.open(ProcessoFormDialog, { ...DIALOG_PADRAO, data })
      .afterClosed()
      .subscribe(salvou => {
        if (salvou) this.carregar();
      });
  }
}