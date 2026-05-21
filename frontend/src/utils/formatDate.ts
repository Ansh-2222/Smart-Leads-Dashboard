const DATE_LOCALE = 'en-US';

export const formatDate = (value: string | Date): string =>
  new Date(value).toLocaleDateString(DATE_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatDateTime = (value: string | Date): string =>
  new Date(value).toLocaleString(DATE_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
