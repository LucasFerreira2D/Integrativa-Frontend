import { MatPaginatorIntl } from '@angular/material/paginator';

export function paginatorIntlPtBr(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();

  intl.itemsPerPageLabel = 'Itens por página:';
  intl.nextPageLabel = 'Próxima página';
  intl.previousPageLabel = 'Página anterior';
  intl.firstPageLabel = 'Primeira página';
  intl.lastPageLabel = 'Última página';

  intl.getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) return `0 de ${length}`;

    const inicio = page * pageSize;
    const fim = Math.min(inicio + pageSize, length);

    return `${inicio + 1} – ${fim} de ${length}`;
  };

  return intl;
}