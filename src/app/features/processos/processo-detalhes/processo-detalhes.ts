import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProcessoService } from '../../../core/processo.service';
import {
  ProcessoDetalhe, STATUS_CLASSE, StatusProcesso, TIPO_PARTE_ROTULO
} from '../../../models/processo.model';
import { AuditoriaInfo } from '../../../shared/auditoria-info/auditoria-info';
import { DIALOG_LISTA } from '../../../shared/dialog-config';
import { AndamentoDialog, AndamentoDialogData } from '../andamento-dialog/andamento-dialog';
import { ParteDialog, ParteDialogData } from '../parte-dialog/parte-dialog';

@Component({
  selector: 'app-processo-detalhes',
  imports: [
    DatePipe, RouterLink, AuditoriaInfo, MatButtonModule, MatDialogModule,
    MatDividerModule, MatIconModule, MatProgressBarModule
  ],
  templateUrl: './processo-detalhes.html',
  styleUrl: './processo-detalhes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessoDetalhes {
  private readonly service = inject(ProcessoService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  readonly rotuloTipo = TIPO_PARTE_ROTULO;
  readonly processo = signal<ProcessoDetalhe | null>(null);
  readonly carregando = signal(false);

  constructor() {
    this.carregar();
  }

  classeStatus(status: StatusProcesso): string {
    return STATUS_CLASSE[status];
  }

  carregar(): void {
    this.carregando.set(true);

    this.service.obter(this.id).subscribe({
      next: processo => {
        this.processo.set(processo);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        this.router.navigate(['/processos']);
      }
    });
  }

  gerenciarPartes(): void {
    const processo = this.processo();
    if (!processo) return;

    const data: ParteDialogData = { processoId: this.id, numero: processo.numero };

    this.dialog.open(ParteDialog, { ...DIALOG_LISTA, data, disableClose: true })
      .afterClosed()
      .subscribe(alterou => {
        if (alterou) this.carregar();
      });
  }

  gerenciarAndamentos(): void {
    const processo = this.processo();
    if (!processo) return;

    const data: AndamentoDialogData = { processoId: this.id, numero: processo.numero };

    this.dialog.open(AndamentoDialog, { ...DIALOG_LISTA, data, disableClose: true })
      .afterClosed()
      .subscribe(alterou => {
        if (alterou) this.carregar();
      });
  }
}
