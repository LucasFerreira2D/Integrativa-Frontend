import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  titulo: string;
  mensagem: string;
  confirmar?: string;
  perigo?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>

    <mat-dialog-content>
      <p>{{ data.mensagem }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-flat-button [class.acao-perigo]="data.perigo" (click)="dialogRef.close(true)">
        {{ data.confirmar ?? 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content p { margin: 0; }
  `
})
export class ConfirmDialog {
  readonly dialogRef = inject<MatDialogRef<ConfirmDialog, boolean>>(MatDialogRef);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
