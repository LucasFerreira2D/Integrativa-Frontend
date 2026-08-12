import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { errorInterceptor } from './core/error.interceptor';
import { paginatorIntlPtBr } from './core/paginator-intl';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useFactory: paginatorIntlPtBr }
  ]
};
