import { MatDialogConfig } from '@angular/material/dialog';

export const DIALOG_PADRAO: MatDialogConfig = {
  width: '640px',
  maxWidth: '95vw',
  maxHeight: '85vh',
  panelClass: 'dialog-padrao'
};

export const DIALOG_LISTA: MatDialogConfig = {
  ...DIALOG_PADRAO,
  height: '560px'
};

export const DIALOG_CONFIRMACAO: MatDialogConfig = {
  width: '420px',
  maxWidth: '95vw'
};