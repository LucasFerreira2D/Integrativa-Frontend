import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Auditoria } from '../../models/processo.model';

@Component({
  selector: 'app-auditoria-info',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (auditoria(); as a) {
      <span class="auditoria" [class.bloco]="bloco()">
        <span class="usuario">{{ a.usuarioAlteracao }}</span>
        <span class="data">{{ a.dataAlteracao | date: 'dd/MM/yyyy HH:mm' }}</span>
      </span>
    }
  `,
  styles: `
    .auditoria {
      display: inline-flex;
      gap: 4px 8px;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
      white-space: nowrap;
    }

    .auditoria.bloco {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .usuario {
      color: var(--mat-sys-on-surface);
    }
  `
})
export class AuditoriaInfo {
  readonly auditoria = input<Auditoria | null>(null);
  readonly bloco = input(false);
}