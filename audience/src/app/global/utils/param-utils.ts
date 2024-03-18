export function getArrayFromParams(params?: string | string[]): string[] {
  if (!params || (params && !params.length)) {
    return [];
  }

  return typeof params === 'string' ? [params] : params;
}
