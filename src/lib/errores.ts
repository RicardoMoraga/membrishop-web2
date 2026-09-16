type ErrorConCausa = { code?: unknown; cause?: unknown };

/** Código SQLSTATE de Postgres, buscado en el error y en su cadena `cause` (Drizzle lo envuelve). */
export function codigoPostgres(error: unknown): string | undefined {
  let actual = error;
  for (let nivel = 0; nivel < 5 && actual !== null && typeof actual === "object"; nivel++) {
    const { code, cause } = actual as ErrorConCausa;
    if (typeof code === "string") return code;
    actual = cause;
  }
  return undefined;
}

/**
 * Resumen apto para logs. Omite `message` a propósito: `DrizzleQueryError` incluye
 * los parámetros de la consulta (correo, nombre, teléfono, tokens) y Postgres puede
 * citar valores de entrada en el suyo.
 */
export function resumenError(error: unknown): string {
  if (!(error instanceof Error)) return `valor no-Error (${typeof error})`;
  const partes = [error.name];
  if (error.cause instanceof Error) partes.push(`causa ${error.cause.name}`);
  const codigo = codigoPostgres(error);
  if (codigo) partes.push(`código ${codigo}`);
  return partes.join(" · ");
}
