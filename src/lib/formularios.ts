/**
 * Tipos y constantes compartidos por los formularios y sus Server Actions.
 *
 * ¿Por qué viven acá y no dentro de `app/actions/lead.ts`?
 * Porque un archivo con `"use server"` SOLO puede exportar funciones async.
 * Si exporta además un objeto o una constante, Next falla en tiempo de
 * ejecución con "A 'use server' file can only export async functions" y la
 * acción entera devuelve 500. Los tipos se borran al compilar y no molestan,
 * pero un valor como `estadoInicial` sí, así que va en un módulo aparte.
 */

export type EstadoFormulario = {
  estado: "inicial" | "ok" | "error";
  mensaje: string;
  /** Errores por campo, para pintarlos bajo el input correspondiente. */
  errores?: Record<string, string>;
};

export const estadoInicial: EstadoFormulario = { estado: "inicial", mensaje: "" };
