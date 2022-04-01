export function commaReplace(str: string) {
  while (str?.includes(',')) {
    str = str?.replace(',', '');
  }
  return str;
}

export function formatYMD(date: Date) {
  return date.toISOString().slice(0, 10);
}


console.log(process.env.NODE_ENV)