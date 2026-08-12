import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ProcessoService } from '../../../core/processo.service';
import { Auditoria, STATUS_OPCOES, StatusProcesso } from '../../../models/processo.model';
import { AuditoriaInfo } from '../../../shared/auditoria-info/auditoria-info';

export interface ProcessoFormDialogData {
  id?: string;
}

@Component({
  selector: 'app-processo-form-dialog',
  imports: [
    ReactiveFormsModule, AuditoriaInfo, MatButtonModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatProgressBarModule, MatSelectModule
  ],
  templateUrl: './processo-form-dialog.html',
  styleUrl: './processo-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessoFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProcessoService);
  private readonly dialogRef = inject<MatDialogRef<ProcessoFormDialog, boolean>>(MatDialogRef);
  private readonly data = inject<ProcessoFormDialogData>(MAT_DIALOG_DATA, { optional: true }) ?? {};

  readonly statusOpcoes = STATUS_OPCOES;
  readonly salvando = signal(false);
  readonly carregando = signal(false);
  readonly auditoria = signal<Auditoria | null>(null);
  readonly id = this.data.id ?? null;
  readonly edicao = this.id !== null;

  readonly form = this.fb.nonNullable.group({
    numero: ['', [Validators.required, Validators.maxLength(50)]],
    assunto: ['', [Validators.required, Validators.maxLength(500)]],
    status: ['Ativo' as StatusProcesso, Validators.required]
  });

  constructor() {
    if (!this.id) return;

    this.carregando.set(true);
    this.service.obter(this.id).subscribe({
      next: processo => {
        this.form.patchValue({
          numero: processo.numero,
          assunto: processo.assunto,
          status: processo.status
        });
        this.auditoria.set(processo);
        this.carregando.set(false);
      },
      error: () => this.dialogRef.close(false)
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    const payload = this.form.getRawValue();

    const requisicao: Observable<unknown> = this.id
      ? this.service.atualizar(this.id, payload)
      : this.service.criar(payload);

    requisicao.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.salvando.set(false)
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
