/**
 * Serializa datos estructurados a <script type="application/ld+json">.
 * Escapa `<` para que un texto de FAQ no pueda cerrar el script.
 */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;

  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // El contenido proviene de nuestros propios módulos, no de input de usuario.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
