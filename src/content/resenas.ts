/**
 * Opiniones de clientes. SOLO reseñas reales y verificables (con permiso del
 * cliente para publicarlas). Mientras la lista esté vacía, el bloque de la home
 * no se renderiza. No agregar ejemplos ni nombres ficticios.
 */
export type Resena = {
  texto: string;
  /** Nombre como el cliente autorizó mostrarlo, p. ej. "Camila R." */
  autor: string;
  ciudad?: string;
  /** 1 a 5. */
  estrellas: 1 | 2 | 3 | 4 | 5;
  /** Slug del producto reseñado (igual al handle de Shopify). Si falta, la reseña es de la tienda. */
  producto?: string;
};

export const resenas: readonly Resena[] = [];
