import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

function extrairMensagem(error: HttpErrorResponse): string {
  if (error.status === 0) return 'Não foi possível conectar à API.';

  const body = error.error;

  if (body?.errors && typeof body.errors === 'object') {
    const mensagens = Object.values(body.errors as Record<string, string[]>).flat();
    if (mensagens.length) return mensagens.join(' ');
  }

  return body?.detail ?? body?.title ?? 'Ocorreu um erro inesperado.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      snackBar.open(extrairMensagem(error), 'Fechar', { duration: 6000 });
      return throwError(() => error);
    })
  );
};