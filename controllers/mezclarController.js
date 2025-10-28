import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Usa la variable de entorno
});

export const mezclarElementos = async (req, res) => {
  const { elementos } = req.body;

  if (!elementos || !Array.isArray(elementos) || elementos.length < 2) {
    return res
      .status(400)
      .json({ error: 'Proporcione al menos dos elementos para mezclar.' });
  }

  const prompt = `
Eres un químico experto. Dados los elementos: ${elementos.join(', ')}

1. Indica si es posible formar un compuesto químico simple con esos elementos.
2. Si hay más de dos elementos, sugiere posibles compuestos que se puedan formar.
3. Recomienda elementos similares o alternativos a los elementos dados para que se puedan formar compuestos parecidos.
4. Si no es posible formar un compuesto, indica eso claramente.
5. Da sugerencias de mezclas válidas con elementos similares o alternativos.

Responde SOLO en formato JSON así:

{
  "resultado": "Fórmula o lista de compuestos",
  "descripcion": "Descripción breve o explicación",
  "elementos_similares": ["Lista de elementos similares o alternativos"],
  "sugerencias": ["Ejemplos de mezclas válidas"]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const respuesta = completion.choices[0].message.content.trim();
    console.log('Respuesta raw de OpenAI:', respuesta);

    try {
      const json = JSON.parse(respuesta);
      return res.json(json);
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      return res
        .status(500)
        .json({ error: 'La respuesta no fue un JSON válido', respuesta });
    }
  } catch (err) {
    console.error('Error al consultar la API de OpenAI:', err);
    return res.status(500).json({ error: 'Error al procesar la mezcla' });
  }
};
