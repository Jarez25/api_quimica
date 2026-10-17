import 'dotenv/config';
import OpenAI from 'openai';
import { resolverCompuestoEstequiometrico } from '../data/compuestosDatabase.js';

// Adaptador multimodelo con soporte para proveedores de IA gratuitos y premium
const getAIClient = () => {
  // 1. Google Gemini (100% Gratis - Google AI Studio)
  if (process.env.GEMINI_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      }),
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      provider: 'Google Gemini (Free Tier)',
    };
  }

  // 2. Groq Cloud (100% Gratis - Inferencia Llama ultra-rápida)
  if (process.env.GROQ_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      provider: 'Groq Cloud (Free Tier)',
    };
  }

  // 3. OpenRouter (Modelos gratuitos disponibles con :free)
  if (process.env.OPENROUTER_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      }),
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
      provider: 'OpenRouter Free',
    };
  }

  // 4. OpenAI (gpt-4o-mini estándar)
  if (process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      provider: 'OpenAI',
    };
  }

  return null;
};

export const mezclarElementos = async (req, res) => {
  const { elementos, reactivos } = req.body;

  // Normalizar lista de reactivos con cantidades
  let listaReactivos = [];

  if (Array.isArray(reactivos) && reactivos.length >= 2) {
    listaReactivos = reactivos.map((r) => ({
      elemento: String(r.elemento || r.simbolo || '').trim().charAt(0).toUpperCase() + String(r.elemento || r.simbolo || '').slice(1).toLowerCase(),
      cantidad: Math.max(1, parseInt(r.cantidad, 10) || 1),
    })).filter((r) => r.elemento);
  } else if (Array.isArray(elementos) && elementos.length >= 2) {
    listaReactivos = elementos.map((el) => ({
      elemento: String(el).trim().charAt(0).toUpperCase() + String(el).slice(1).toLowerCase(),
      cantidad: 1,
    })).filter((r) => r.elemento);
  } else {
    return res.status(400).json({
      error: 'Debe enviar un arreglo de reactivos con sus cantidades o un arreglo de elementos.',
      ejemplo: {
        reactivos: [
          { elemento: 'H', cantidad: 3 },
          { elemento: 'O', cantidad: 1 },
        ],
      },
    });
  }

  if (listaReactivos.length < 2) {
    return res.status(400).json({
      error: 'Proporcione al menos dos reactivos para realizar el análisis estequiométrico.',
    });
  }

  if (listaReactivos.length > 5) {
    return res.status(400).json({
      error: 'Puedes combinar un máximo de 5 reactivos químicos por análisis.',
    });
  }

  // 1. BASE DE CONOCIMIENTO AUTORITARIA DE LABORATORIO (Resolución instantánea sin costo de tokens)
  const coincidenciaLocal = resolverCompuestoEstequiometrico(listaReactivos);
  if (coincidenciaLocal) {
    return res.json({
      ...coincidenciaLocal,
      origen_datos: 'catalogo_estequiometrico_calibrado',
      reactivos_solicitados: listaReactivos,
    });
  }

  // 2. VERIFICAR SI HAY UN PROVEEDOR DE IA DISPONIBLE (Gratuito o de pago)
  const aiProvider = getAIClient();
  if (!aiProvider) {
    return res.status(503).json({
      error: 'Especie química fuera del catálogo estándar local',
      detalle: 'Esta proporción no está en la base local pre-calibrada. Puedes activar una IA GRATIS configurando GEMINI_API_KEY (de Google AI Studio) o GROQ_API_KEY (de Groq Console) en tu archivo .env o en Vercel.',
      reactivos_evaluados: listaReactivos,
      proveedores_gratuitos_compatibles: [
        { nombre: 'Google Gemini (15 RPM / 1M TPM Gratis)', variable: 'GEMINI_API_KEY', web: 'https://aistudio.google.com/app/apikey' },
        { nombre: 'Groq Cloud (Llama 3.3 Gratis)', variable: 'GROQ_API_KEY', web: 'https://console.groq.com/keys' },
      ],
      especies_sugeridas_disponibles: [
        'H:2 + O:1 (Agua H2O)',
        'H:1 + O:1 (Radical Hidroxilo HO•)',
        'H:3 + O:1 (Ion Hidronio H3O+)',
        'H:2 + O:2 (Peróxido de Hidrógeno H2O2)',
        'C:1 + O:1 (Monóxido de Carbono CO)',
        'C:1 + O:2 (Dióxido de Carbono CO2)',
        'N:1 + H:3 (Amoníaco NH3)',
        'N:1 + H:4 (Ion Amonio NH4+)',
        'Na:1 + Cl:1 (Cloruro de Sodio NaCl)',
        'H:2 + S:1 + O:4 (Ácido Sulfúrico H2SO4)',
      ],
    });
  }

  // 3. CONSULTA ESTEQUIOMÉTRICA CON EL MOTOR DE IA
  const formulaBruta = listaReactivos.map((r) => `${r.elemento}${r.cantidad > 1 ? r.cantidad : ''}`).join('');
  const descripcionReactivos = listaReactivos.map((r) => `${r.elemento} (cantidad: ${r.cantidad})`).join(', ');

  const prompt = `
Analiza con rigor de laboratorio químico profesional la siguiente especie o combinación estequiométrica:
Reactivos y proporciones exactas solicitadas: ${descripcionReactivos}
Fórmula bruta resultante: ${formulaBruta}

Reglas científicas fundamentales:
1. Respeta escrupulosamente las cantidades atómicas enviadas por el usuario.
   - Si el usuario envió H=1 y O=1, explica el Radical Hidroxilo (HO•), su naturaleza radicalaria y reactividad, NO fuerces H2O.
   - Si el usuario envió H=3 y O=1, explica el Catión Hidronio (H3O+) o especie protonada, su geometría piramidal y su rol en disolución ácida.
   - Si el usuario envió H=2 y O=1, explica el Agua neutra (H2O).
   - Si el usuario envió H=2 y O=2, explica el Peróxido de hidrógeno (H2O2).
2. Clasifica el tipo de especie: 'Molécula neutra estable', 'Radical libre', 'Catión/Anión poliatómico', o 'Especie inestable/Hipotética'.
3. Detalla geometría molecular, estabilidad termodinámica y entalpía de formación estimada.
4. Indica nivel de peligro GHS: 'bajo', 'medio', 'alto' o 'desconocido'.
5. Explica advertencias de seguridad y normas de laboratorio sin dar instrucciones para la síntesis ilícita o peligrosa.

Responde ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta:
{
  "posible": true,
  "resultado": "${formulaBruta}",
  "nombre": "Nombre IUPAC o Común",
  "formula_html": "Fórmula con etiquetas sub y sup ej: H<sub>2</sub>O",
  "tipo_especie": "Molécula neutra / Radical / Ion",
  "descripcion": "Explicación física y termodinámica completa",
  "geometria_molecular": "Geometría ej. Angular 104.5°",
  "momento_dipolar": "ej. 1.85 D",
  "entalpia_formacion": "ej. -285.8 kJ/mol",
  "estabilidad": "Estable / Radical reactivo / Catión en solución",
  "nivel_peligro": "bajo",
  "riesgos": ["Riesgo 1", "Riesgo 2"],
  "advertencia_seguridad": "Aviso de laboratorio",
  "comparacion_contextual": "Comparación con otras proporciones del mismo sistema",
  "sugerencias_seguras": ["Especie 1", "Especie 2"],
  "nota": "Dato científico adicional",
  "componentes": [
    ${listaReactivos.map((r) => `{"elemento": "${r.elemento}", "nombre": "Nombre del elemento", "cantidad": ${r.cantidad}}`).join(',\n    ')}
  ]
}
`;

  try {
    const completion = await aiProvider.client.chat.completions.create({
      model: aiProvider.model,
      messages: [
        {
          role: 'system',
          content:
            'Eres un químico doctorado experto en termodinámica y estequiometría molecular. Devuelve exclusivamente JSON válido sin bloques markdown adicionales ni texto extra.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const mensaje = completion.choices[0]?.message;
    if (mensaje?.refusal) {
      return res.status(400).json({
        error: 'Consulta rechazada por protocolos de seguridad.',
        detalle: mensaje.refusal,
      });
    }

    const respuesta = mensaje?.content;
    if (!respuesta) {
      return res.status(500).json({
        error: 'El proveedor de IA no devolvió una respuesta válida.',
      });
    }

    let cleanContent = String(respuesta).trim();
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    const json = JSON.parse(cleanContent);

    return res.json({
      origen_datos: 'analisis_ia_estequiometrico',
      proveedor_ia: aiProvider.provider,
      reactivos_solicitados: listaReactivos,
      ...json,
    });
  } catch (err) {
    console.error('❌ Error al procesar la síntesis:', err);
    return res.status(500).json({
      error: 'Error al procesar la mezcla estequiométrica con IA',
      detalle: err.message,
    });
  }
};