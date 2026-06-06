import 'dotenv/config';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Falta OPENAI_API_KEY en el archivo .env');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const mezclarElementos = async (req, res) => {
  const { elementos } = req.body;

  if (!elementos || !Array.isArray(elementos)) {
    return res.status(400).json({
      error: 'Debe enviar un arreglo de elementos.',
      ejemplo: {
        elementos: ['H', 'O'],
      },
    });
  }

  if (elementos.length < 2) {
    return res.status(400).json({
      error: 'Proporcione al menos dos elementos para mezclar.',
    });
  }

  if (elementos.length > 5) {
    return res.status(400).json({
      error: 'Puedes mezclar un máximo de 5 elementos por consulta.',
    });
  }

  const elementosLimpios = elementos
    .map((el) => String(el).trim())
    .filter(Boolean)
    .map((el) => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase());

  const elementosUnicos = [...new Set(elementosLimpios)];

  if (elementosUnicos.length < 2) {
    return res.status(400).json({
      error: 'Debe enviar al menos dos elementos diferentes válidos.',
    });
  }

  const prompt = `
Analiza esta posible combinación química de forma educativa y segura.

Elementos recibidos:
${elementosUnicos.join(', ')}

Reglas importantes:
1. No asumas que la cantidad enviada de elementos es la cantidad de átomos.
2. Debes calcular o proponer la estequiometría básica del compuesto.
3. Ejemplo correcto: si los elementos son H y O, el compuesto agua debe representarse como H2O.
4. Para H2O, la composición molecular correcta es:
   - H cantidad 2
   - O cantidad 1
5. Si hay más de dos elementos, sugiere compuestos posibles con esos elementos.
6. Puedes proponer compuestos simples y conocidos.
7. Debes indicar cuántos átomos de cada elemento tiene cada fórmula.
8. Indica si la combinación puede formar un compuesto conocido.
9. Indica nivel de peligro: bajo, medio, alto o desconocido.
10. Explica riesgos generales sin dar instrucciones peligrosas.
11. No des pasos de fabricación, proporciones de laboratorio, temperaturas, presión, purificación, métodos de síntesis ni instrucciones operativas.
12. Si una combinación puede ser tóxica, corrosiva, inflamable, explosiva o peligrosa, adviértelo claramente.
13. Si no existe un compuesto común, dilo claramente y sugiere alternativas educativas seguras.

Responde únicamente como JSON válido según el esquema.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente educativo experto en química. Tu función es explicar combinaciones químicas de forma segura. No debes proporcionar instrucciones prácticas para fabricar sustancias peligrosas, explosivas, tóxicas, inflamables o corrosivas. Devuelve únicamente JSON válido según el esquema solicitado.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'resultado_mezcla_quimica',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              posible: {
                type: 'boolean',
              },
              resultado: {
                type: 'string',
              },
              compuestos_posibles: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    formula: {
                      type: 'string',
                    },
                    formula_html: {
                      type: 'string',
                    },
                    nombre: {
                      type: 'string',
                    },
                    descripcion: {
                      type: 'string',
                    },
                    tipo: {
                      type: 'string',
                    },
                    componentes: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          elemento: {
                            type: 'string',
                          },
                          nombre: {
                            type: 'string',
                          },
                          cantidad: {
                            type: 'integer',
                          },
                        },
                        required: ['elemento', 'nombre', 'cantidad'],
                      },
                    },
                  },
                  required: [
                    'formula',
                    'formula_html',
                    'nombre',
                    'descripcion',
                    'tipo',
                    'componentes',
                  ],
                },
              },
              descripcion: {
                type: 'string',
              },
              nivel_peligro: {
                type: 'string',
                enum: ['bajo', 'medio', 'alto', 'desconocido'],
              },
              riesgos: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              advertencia_seguridad: {
                type: 'string',
              },
              elementos_similares: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              sugerencias_seguras: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              nota: {
                type: 'string',
              },
            },
            required: [
              'posible',
              'resultado',
              'compuestos_posibles',
              'descripcion',
              'nivel_peligro',
              'riesgos',
              'advertencia_seguridad',
              'elementos_similares',
              'sugerencias_seguras',
              'nota',
            ],
          },
        },
      },
    });

    const mensaje = completion.choices[0]?.message;

    if (mensaje?.refusal) {
      return res.status(400).json({
        error: 'La IA rechazó procesar esta mezcla por seguridad.',
        detalle: mensaje.refusal,
      });
    }

    const respuesta = mensaje?.content;

    if (!respuesta) {
      return res.status(500).json({
        error: 'La IA no devolvió una respuesta válida.',
      });
    }

    let json;

    try {
      json = JSON.parse(respuesta);
    } catch (parseError) {
      console.error('❌ Error al convertir respuesta JSON:', parseError);
      console.error('Respuesta recibida:', respuesta);

      return res.status(500).json({
        error: 'La IA devolvió una respuesta que no se pudo convertir a JSON.',
      });
    }

    return res.json({
      elementos: elementosUnicos,
      maximo_elementos_permitidos: 5,
      ...json,
    });
  } catch (err) {
    console.error('❌ Error al consultar la API de OpenAI:', err);

    return res.status(500).json({
      error: 'Error al procesar la mezcla con IA',
      detalle: err.message,
    });
  }
};