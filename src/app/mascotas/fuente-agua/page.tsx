import type { Metadata } from "next";
import { PdpTemplate, type ContenidoFicha } from "@/components/templates/PdpTemplate";
import { buildMetadata } from "@/lib/seo";

/* ============================================================================
   Ficha de producto — envoltorio delgado sobre PdpTemplate.
   URL: /mascotas/fuente-agua  (slug sin stopwords ni conectores)

   Aquí solo vive contenido editorial. Precio, stock, disponibilidad, variantes
   y SKU los resuelve la plantilla contra Shopify.
   ========================================================================== */

const CATEGORIA = "mascotas";
const SLUG = "fuente-agua";

const DESCRIPCION =
  "Fuente de agua de 2,4 litros con filtro de carbón activo y flujo continuo, para gatos y perros de hasta 15 kg. Stock en Chile y despacho en 24–72 h hábiles.";

export const metadata: Metadata = buildMetadata({
  // Meta title (54 caracteres) distinto del H1: bajo el corte de ~62 de Google.
  title: "Fuente de Agua para Gatos con Filtro | MembriShop",
  description: DESCRIPCION,
  path: `/${CATEGORIA}/${SLUG}`,
});

const contenido: ContenidoFicha = {
  categoriaSlug: CATEGORIA,
  slug: SLUG,
  // H1 centrado en el producto y distinto del meta title. El ángulo editorial
  // ("por qué tu gato bebe más") bajó al H2 y al primer párrafo: arriba el
  // comprador necesita confirmar en un segundo que llegó a un producto.
  h1: "Fuente de agua con filtro para gatos · 2,4 L",
  resumen: "Flujo continuo y filtro de carbón activo para que tu gato beba más durante el día.",
  tldr: [
    "2,4 litros: unos 3 días para dos gatos sin rellenar.",
    "Filtro de carbón activo con recambio en Chile, dura 3 a 4 semanas.",
    "Bomba silenciosa bajo 40 dB y desmontable para lavar.",
  ],
  intro:
    "Los gatos beben poco por instinto y esa es la razón por la que los problemas urinarios son tan frecuentes. Una fuente con flujo continuo cambia esa conducta: el agua en movimiento les resulta más apetecible y aumentan la ingesta diaria sin que tengas que hacer nada.",
  beneficios: [
    {
      titulo: "Beben más sin que insistas",
      detalle:
        "El movimiento del agua es el estímulo que usan los veterinarios para subir la ingesta diaria en gatos que beben poco.",
    },
    {
      titulo: "Agua limpia entre rellenados",
      detalle:
        "El filtro de carbón activo retiene pelo, restos de comida y sarro, así el estanque no se ensucia a los dos días.",
    },
    {
      titulo: "Silenciosa de verdad",
      detalle:
        "La bomba sumergible trabaja bajo 40 dB. El ruido casi siempre aparece cuando el nivel baja del mínimo y toma aire.",
    },
  ],
  incluye: [
    "Estanque de 2,4 litros con tapa",
    "Bomba sumergible desmontable",
    "Un filtro de carbón activo instalado",
    "Cable USB (adaptador de corriente no incluido)",
  ],
  paraQuien: [
    "Gatos que beben poco o ya tuvieron un episodio urinario",
    "Hogares con uno o dos gatos adultos",
    "Perros de hasta 15 kg",
    "Quien pasa el día fuera y no puede rellenar el bebedero",
  ],
  noSirve:
    "Si tienes tres o más gatos vas a rellenar día por medio y conviene un modelo de mayor capacidad. Tampoco es la opción para perros sobre 15 kg: la mueven al beber. Y si no tienes enchufe cerca del bebedero, considera que necesita alimentación USB permanente.",
  faqs: [
    {
      pregunta: "¿Cada cuánto se cambia el filtro de la fuente de agua?",
      respuesta:
        "Entre 3 y 4 semanas con uso normal de una o dos mascotas. Si el agua se ve turbia o aparece sarro antes de ese plazo, cámbialo igual. Los recambios se venden por separado y tienen stock en Chile.",
    },
    {
      pregunta: "¿Hace mucho ruido durante la noche?",
      respuesta:
        "La bomba sumergible trabaja bajo 40 dB, comparable a una conversación en voz baja. El ruido casi siempre aparece cuando el nivel de agua baja del mínimo y la bomba toma aire: rellenando la fuente se soluciona.",
    },
    {
      pregunta: "¿Sirve si tengo dos gatos?",
      respuesta:
        "Sí. Con 2,4 litros dos gatos adultos tienen agua para unos tres días. Si son tres o más, conviene rellenar día por medio.",
    },
    {
      pregunta: "¿Se puede lavar completa?",
      respuesta:
        "El estanque y la tapa se lavan a mano con agua tibia y jabón neutro. La bomba se desmonta para limpiar el rotor, que es donde se acumula el sarro. No es apta para lavavajillas.",
    },
  ],
};

export default function Page() {
  return <PdpTemplate contenido={contenido} />;
}
