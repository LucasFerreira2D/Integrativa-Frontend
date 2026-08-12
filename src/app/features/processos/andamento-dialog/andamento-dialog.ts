import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProcessoService } from '../../../core/processo.service';
import { Andamento } from '../../../models/processo.model';
import { AuditoriaInfo } from '../../../shared/auditoria-info/auditoria-info';
import { ConfirmDialog, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog';
import { DIALOG_CONFIRMACAO } from '../../../shared/dialog-config';

export interface AndamentoDialogData {
  processoId: string;
  numero: string;
}

@Component({
  selector: 'app-andamento-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    DatePipe, ReactiveFormsModule, AuditoriaInfo, MatButtonModule,
    MatDatepickerModule, MatDialogModule, MatDividerModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatProgressBarModule
  ],
  templateUrl: './andamento-dialog.html',
  styleUrl: './andamento-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AndamentoDialog {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProcessoService);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject<MatDialogRef<AndamentoDialog, boolean>>(MatDialogRef);
  readonly data = inject<AndamentoDialogData>(MAT_DIALOG_DATA);

  readonly andamentos = signal<Andamento[]>([]);
  readonly carregando = signal(false);
  readonly salvando = signal(false);

  private houveMudanca = false;

  readonly form = this.fb.nonNullable.group({
    data: [new Date(), Validators.required],
    descricao: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  private readonly formDirective = viewChild.required(FormGroupDirective);

  constructor() {
    this.carregar();

    this.dialogRef.backdropClick().subscribe(() => this.fechar());
    this.dialogRef.keydownEvents().subscribe(evento => {
      if (evento.key === 'Escape') this.fechar();
    });
  }

  carregar(): void {
    this.carregando.set(true);

    this.service.obter(this.data.processoId).subscribe({
      next: processo => {
        this.andamentos.set(processo.andamentos);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  adicionar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { data, descricao } = this.form.getRawValue();
    this.salvando.set(true);

    this.service.adicionarAndamento(this.data.processoId, data.toISOString(), descricao).subscribe({
      next: () => {
        this.formDirective().resetForm({ data: new Date(), descricao: '' });
        this.houveMudanca = true;
        this.salvando.set(false);
        this.carregar();
      },
      error: () => this.salvando.set(false)
    });
  }

  remover(andamento: Andamento): void {
    const data: ConfirmDialogData = {
      titulo: 'Remover andamento',
      mensagem: `Remover "${andamento.descricao}" deste processo?`,
      confirmar: 'Remover',
      perigo: true
    };

    this.dialog.open(ConfirmDialog, { ...DIALOG_CONFIRMACAO, data })
      .afterClosed()
      .subscribe(confirmado => {
        if (!confirmado) return;

        this.service.removerAndamento(this.data.processoId, andamento.id).subscribe(() => {
          this.houveMudanca = true;
          this.carregar();
        });
      });
  }

  fechar(): void {
    this.dialogRef.close(this.houveMudanca);
  }
}