import { z } from "zod";

/**
 * Validación de los formularios, con Zod.
 *
 * La validación de verdad vive acá, en el servidor. Lo que hace el navegador
 * (`required`, `type="email"`) es comodidad para el usuario, no seguridad:
 * cualquiera puede mandar un POST a mano.
 */

/** Normaliza un correo: sin espacios y en minúsculas, para que el índice único funcione. */
const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Escribe un correo válido.")
  .max(320, "Ese correo es demasiado largo.")
  .email("Ese correo no parece válido.");

const nombre = z
  .string()
  .trim()
  .min(2, "Escribe tu nombre.")
  .max(120, "El nombre es demasiado largo.");

/**
 * Teléfono chileno. Acepta lo que la gente escribe de verdad
 * (+56 9 1234 5678, 912345678, 56912345678) y lo normaliza a E.164.
 */
const telefonoChile = z
  .string()
  .trim()
  .transform((valor) => valor.replace(/[\s().-]/g, ""))
  .refine(
    (v) => v === "" || /^(\+?56)?9\d{8}$/.test(v),
    "Ese número no parece un celular chileno (9 dígitos, partiendo por 9).",
  )
  .transform((v) => {
    if (v === "") return null;
    const soloDigitos = v.replace(/^\+?56/, "");
    return `+56${soloDigitos}`;
  });

/**
 * Campo trampa: invisible para personas, irresistible para bots.
 *
 * A propósito NO falla la validación cuando viene lleno. Si lo hiciera, el
 * envío volvería como "revisa los datos marcados" sin ningún campo marcado
 * —porque el campo está fuera de pantalla— y de paso le confirmaría al bot que
 * lo detectaste. En vez de eso pasa la validación, y la Server Action responde
 * un éxito falso y descarta el envío en silencio.
 */
const honeypot = z.string().max(200).optional();

export const esquemaNewsletter = z.object({
  email,
  nombre: z.string().trim().max(120).optional().or(z.literal("")),
  origen: z.string().trim().max(120).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  sitioWeb: honeypot,
});

export const esquemaContacto = z.object({
  nombre,
  email,
  telefono: telefonoChile.optional(),
  asunto: z.string().trim().max(160).optional().or(z.literal("")),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más: al menos 10 caracteres.")
    .max(4000, "El mensaje es demasiado largo. Máximo 4000 caracteres."),
  origen: z.string().trim().max(120).optional(),
  sitioWeb: honeypot,
});

export type DatosNewsletter = z.infer<typeof esquemaNewsletter>;
export type DatosContacto = z.infer<typeof esquemaContacto>;

/**
 * Convierte los errores de Zod a `{ campo: "mensaje" }`, que es lo que el
 * formulario necesita para pintar el error bajo el input correcto.
 */
export function erroresPorCampo(error: z.ZodError): Record<string, string> {
  const salida: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? "_");
    if (!salida[campo]) salida[campo] = issue.message;
  }
  return salida;
}
