import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ProcessoService } from '../../../core/processo.service';
import {
  Parte, TIPO_PARTE_OPCOES, TIPO_PARTE_ROTULO, TipoParte
} from '../../../models/processo.model';
import { AuditoriaInfo } from '../../../shared/auditoria-info/auditoria-info';
import { ConfirmDialog, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog';
import { DIALOG_CONFIRMACAO } from '../../../shared/dialog-config';

export interface ParteDialogData {
  processoId: string;
  numero: string;
}

@Component({
  selector: 'app-parte-dialog',
  imports: [
    ReactiveFormsModule, AuditoriaInfo, MatButtonModule, MatDialogModule,
    MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatProgressBarModule, MatSelectModule
  ],
  templateUrl: './parte-dialog.html',
  styleUrl: './parte-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParteDialog {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProcessoService);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject<MatDialogRef<ParteDialog, boolean>>(MatDialogRef);
  readonly data = inject<ParteDialogData>(MAT_DIALOG_DATA);

  readonly tipoOpcoes = TIPO_PARTE_OPCOES;
  readonly rotuloTipo = TIPO_PARTE_ROTULO;

  readonly partes = signal<Parte[]>([]);
  readonly carregando = signal(false);
  readonly salvando = signal(false);

  private houveMudanca = false;

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(200)]],
    tipo: ['Interessada' as TipoParte, Validators.required]
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
        this.partes.set(processo.partes);
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

    const { nome, tipo } = this.form.getRawValue();
    this.salvando.set(true);

    this.service.adicionarParte(this.data.processoId, nome, tipo).subscribe({
      next: () => {
        this.formDirective().resetForm({ nome: '', tipo: 'Interessada' });
        this.houveMudanca = true;
        this.salvando.set(false);
        this.carregar();
      },
      error: () => this.salvando.set(false)
    });
  }

  remover(parte: Parte): void {
    const data: ConfirmDialogData = {
      titulo: 'Remover parte',
      mensagem: `Remover "${parte.nome}" deste processo?`,
      confirmar: 'Remover',
      perigo: true
    };

    this.dialog.open(ConfirmDialog, { ...DIALOG_CONFIRMACAO, data })
      .afterClosed()
      .subscribe(confirmado => {
        if (!confirmado) return;

        this.service.removerParte(this.data.processoId, parte.id).subscribe(() => {
          this.houveMudanca = true;
          this.carregar();
        });
      });
  }

  fechar(): void {
    this.dialogRef.close(this.houveMudanca);
  }
}