export function commaReplace(str: string) {
  return str
    ?.replace(',', '')
    ?.replace(',', '')
    ?.replace(',', '')
    ?.replace(',', '');
}

export function formatYMD(date: Date) {
  return date.toISOString().slice(0, 10);
}
