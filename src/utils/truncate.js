export const truncate = (text, length, end = '') => (text ?? '').substring(0, length) + end;
