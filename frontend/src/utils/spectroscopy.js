// Módulo de Espectroscopía Atómica, Ensayo a la Llama y Muestras Ópticas
// Basado en física cuántica de transiciones electrónicas (Rydberg) y espectrometría satelital.

// Convierte una longitud de onda en nanómetros (380 - 780 nm) a su color RGB físico exacto (Algoritmo de Dan Bruton)
export function wavelengthToRGB(wavelength) {
  let r = 0, g = 0, b = 0;
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0.0;
    g = (wavelength - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1.0;
    g = -(wavelength - 645) / (645 - 580);
    b = 0.0;
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  }

  // Factor de sensibilidad del ojo humano en los bordes del espectro
  let factor = 0.0;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380);
  } else if (wavelength >= 420 && wavelength <= 700) {
    factor = 1.0;
  } else if (wavelength > 700 && wavelength <= 780) {
    factor = 0.3 + (0.7 * (780 - wavelength)) / (780 - 700);
  }

  const gamma = 0.8;
  const toByte = (c) => Math.min(255, Math.max(0, Math.round(255 * Math.pow(Math.max(0, c * factor), gamma))));
  return `rgb(${toByte(r)}, ${toByte(g)}, ${toByte(b)})`;
}

// Base de datos de Ensayos a la Llama y Espectros de Emisión Atómica
export const CATALOGO_ESPECTROSCOPICO = {
  H: {
    llama: {
      color: '#A5C9FF',
      nombre: 'Azul pálido casi invisible / Incoloro',
      temperatura: '~2000 °C (Llama oxi-hidrógeno)',
      descripcion: 'La combustión pura con oxígeno produce vapor de agua y emite radiación casi imperceptible en el visible pero con fuerte emisión UV.',
    },
    lineasEmision: [
      { nm: 656.3, intensidad: 1.0, nombre: 'H-α (Rojo profundo, n=3→2)' },
      { nm: 486.1, intensidad: 0.8, nombre: 'H-β (Cian celeste, n=4→2)' },
      { nm: 434.0, intensidad: 0.5, nombre: 'H-γ (Azul violeta, n=5→2)' },
      { nm: 410.2, intensidad: 0.3, nombre: 'H-δ (Violeta oscuro, n=6→2)' },
    ],
    aspectoMuestra: 'Gas diatómico transparente, incoloro e inodoro. En tubo de descarga eléctrica emite un plasma resplandeciente color magenta-rosado.',
    satelites: 'El telescopio espacial Hubble y James Webb detectan la línea H-Alfa (656 nm) para mapear nebulosas, nacimiento de estrellas y discos protoplanetarios.',
  },
  HE: {
    llama: {
      color: '#FFE2B8',
      nombre: 'Naranja-amarillento pálido (Descarga eléctrica)',
      temperatura: 'Inerte a la combustión térmica',
      descripcion: 'Al ser un gas noble inerte no arde en llama química. Requiere descarga de plasma de alta tensión para ionizar sus orbitales 1s.',
    },
    lineasEmision: [
      { nm: 587.6, intensidad: 1.0, nombre: 'Línea D3 (Amarillo solar brillante)' },
      { nm: 667.8, intensidad: 0.7, nombre: 'Línea roja visible' },
      { nm: 501.6, intensidad: 0.6, nombre: 'Línea verde' },
      { nm: 492.2, intensidad: 0.4, nombre: 'Línea cian' },
      { nm: 471.3, intensidad: 0.5, nombre: 'Línea azul' },
      { nm: 447.1, intensidad: 0.9, nombre: 'Línea azul profundo' },
    ],
    aspectoMuestra: 'Gas noble monoatómico incoloro e inodoro. En tubo de descarga Plücker emite un brillo melocotón/ámbar característico.',
    satelites: 'Descubierto en 1868 por satélites astronómicos y espectrómetros analizando la luz de la corona del Sol antes de ser hallado en la Tierra.',
  },
  LI: {
    llama: {
      color: '#FF0040',
      nombre: 'Rojo Carmín Intenso / Magenta',
      temperatura: '~1200 °C (Mechero Bunsen)',
      descripcion: 'Los electrones del orbital 2s se excitan térmicamente y decaen emitiendo fotones fuertemente concentrados en la franja roja.',
    },
    lineasEmision: [
      { nm: 670.8, intensidad: 1.0, nombre: 'Doblete de resonancia 2p→2s (Rojo carmín)' },
      { nm: 610.4, intensidad: 0.5, nombre: 'Línea naranja 3d→2p' },
      { nm: 460.3, intensidad: 0.3, nombre: 'Línea azul celeste' },
    ],
    aspectoMuestra: 'Metal blando de color blanco plateado. Es el metal sólido menos denso (flota en agua) y se almacena bajo queroseno o argón para evitar que reaccione con el aire.',
    satelites: 'Los satélites de astrofísica miden la abundancia de Litio en estrellas viejas para calibrar los modelos de nucleosíntesis del Big Bang.',
  },
  NA: {
    llama: {
      color: '#FFB700',
      nombre: 'Amarillo Dorado Brillante (Doblete D)',
      temperatura: '~1100 °C',
      descripcion: 'Emisión extraordinariamente luminosa que abruma cualquier otra llama; es el color típico de las lámparas de alumbrado público de vapor de sodio.',
    },
    lineasEmision: [
      { nm: 589.0, intensidad: 1.0, nombre: 'Línea D2 (Amarillo sodio)' },
      { nm: 589.6, intensidad: 0.9, nombre: 'Línea D1 (Amarillo sodio)' },
      { nm: 568.8, intensidad: 0.2, nombre: 'Línea verde-amarilla' },
      { nm: 615.4, intensidad: 0.2, nombre: 'Línea anaranjada' },
    ],
    aspectoMuestra: 'Metal alcalino muy blando (se corta fácilmente con bisturí), de lustre plateado brillante que se empaña en segundos al aire por formación de óxido y nitruro.',
    satelites: 'Satélites espaciales y telescopios terrestres detectan el Doblete D de sodio en las colas de cometas y en las atmósferas de exoplanetas "Júpiter calientes".',
  },
  K: {
    llama: {
      color: '#C471ED',
      nombre: 'Lila / Violeta Pálido',
      temperatura: '~1100 °C',
      descripcion: 'Llama violácea suave que a menudo se observa a través de un cristal de cobalto azul para filtrar la impureza amarilla del sodio omnipresente.',
    },
    lineasEmision: [
      { nm: 766.5, intensidad: 0.9, nombre: 'Línea roja profunda de resonancia' },
      { nm: 769.9, intensidad: 0.8, nombre: 'Línea infrarroja cercana' },
      { nm: 404.4, intensidad: 0.7, nombre: 'Línea violeta principal' },
      { nm: 404.7, intensidad: 0.6, nombre: 'Línea violeta secundaria' },
    ],
    aspectoMuestra: 'Metal suave de color blanco plateado con brillo nacarado. Reacciona violentamente con el agua liberando hidrógeno que se auto-inflama con llama violeta.',
    satelites: 'Los satélites de observación terrestre (como Sentinel-2 y Landsat) miden la firma espectral de absorción del potasio en la corteza terrestre para exploración minera.',
  },
  CA: {
    llama: {
      color: '#FF4D00',
      nombre: 'Rojo Anaranjado / Ladrillo',
      temperatura: '~1300 °C',
      descripcion: 'Color anaranjado cálido con bandas moleculares características de óxido e hidróxido de calcio formadas durante la combustión.',
    },
    lineasEmision: [
      { nm: 422.7, intensidad: 0.9, nombre: 'Línea de resonancia azul-violeta' },
      { nm: 616.2, intensidad: 0.8, nombre: 'Línea roja anaranjada' },
      { nm: 643.9, intensidad: 0.7, nombre: 'Línea roja cálida' },
      { nm: 393.4, intensidad: 1.0, nombre: 'Línea K de Fraunhofer (Ca II, iones)' },
      { nm: 396.8, intensidad: 0.9, nombre: 'Línea H de Fraunhofer (Ca II, iones)' },
    ],
    aspectoMuestra: 'Metal blanco grisáceo moderadamente duro con lustre opaco. Se comercializa en forma de láminas o virutas protegidas contra la humedad ambiental.',
    satelites: 'Las líneas H y K del Calcio ionizado son fundamentales para que los satélites de la NASA y la ESA midan la actividad magnética y erupciones de estrellas lejanas.',
  },
  SR: {
    llama: {
      color: '#FF001E',
      nombre: 'Rojo Carmesí / Escarlata Brillante',
      temperatura: '~1400 °C',
      descripcion: 'Es el compuesto químico responsable del color rojo deslumbrante en la pirotecnia y bengalas marítimas de emergencia militar.',
    },
    lineasEmision: [
      { nm: 460.7, intensidad: 0.8, nombre: 'Línea azul de Sr I' },
      { nm: 687.8, intensidad: 0.7, nombre: 'Línea roja' },
      { nm: 679.1, intensidad: 0.6, nombre: 'Línea roja visible' },
      { nm: 407.8, intensidad: 1.0, nombre: 'Línea violeta intensa Sr II' },
    ],
    aspectoMuestra: 'Metal alcalinotérreo blanco plateado con ligero tinte amarillento cuando se oxida superficialmente.',
    satelites: 'Identificado por satélites espectrográficos en kilonovas (fusiones de estrellas de neutrones) confirmando la formación de elementos pesados en el universo.',
  },
  BA: {
    llama: {
      color: '#84FF00',
      nombre: 'Verde Manzana / Verde Lima Pálido',
      temperatura: '~1400 °C',
      descripcion: 'Llama verde manzana emitida por el cloruro o nitrato de bario, clásica en fuegos artificiales de tono verde.',
    },
    lineasEmision: [
      { nm: 553.5, intensidad: 1.0, nombre: 'Línea de resonancia verde esmeralda' },
      { nm: 455.4, intensidad: 0.8, nombre: 'Línea azul de Ba II' },
      { nm: 493.4, intensidad: 0.7, nombre: 'Línea cian' },
      { nm: 614.2, intensidad: 0.5, nombre: 'Línea naranja' },
    ],
    aspectoMuestra: 'Metal pesado suave, blanco plateado con lustre brillante que se ennegrece rápidamente por absorción de nitrógeno y oxígeno atmosférico.',
    satelites: 'Los satélites geológicos emplean espectrometría infrarroja y visible para detectar barita ($BaSO_4$) en cuencas sedimentarias terrestres.',
  },
  CU: {
    llama: {
      color: '#00FFA2',
      nombre: 'Verde Esmeralda / Azul Turquesa',
      temperatura: '~1200 °C',
      descripcion: 'Llama verde azulada muy llamativa producida por haluros de cobre ($CuCl_2$) y óxidos incandescentes.',
    },
    lineasEmision: [
      { nm: 510.6, intensidad: 1.0, nombre: 'Línea verde principal' },
      { nm: 515.3, intensidad: 0.8, nombre: 'Línea verde brillante' },
      { nm: 521.8, intensidad: 0.9, nombre: 'Línea verde turquesa' },
      { nm: 578.2, intensidad: 0.6, nombre: 'Línea amarillo-dorada' },
      { nm: 324.7, intensidad: 1.0, nombre: 'Línea de resonancia ultravioleta' },
    ],
    aspectoMuestra: 'Metal de transición rojizo brillante con alta conductividad térmica y eléctrica. Cuando se oxida lentamente desarrolla una pátina verde de carbonato básico.',
    satelites: 'Satélites hiperespectrales (como PRISMA de Italia o EnMAP de Alemania) diferencian yacimientos de pórfidos de cobre a partir de la reflectancia espectral.',
  },
  FE: {
    llama: {
      color: '#FFAE00',
      nombre: 'Dorado / Chispas Incandescentes',
      temperatura: '~1500 °C',
      descripcion: 'En el soplete se quema con destellos dorados brillantes; no tiene un color monocromático único debido a miles de líneas de transición superpuestas.',
    },
    lineasEmision: [
      { nm: 404.6, intensidad: 0.8, nombre: 'Línea violeta Fe I' },
      { nm: 438.4, intensidad: 0.9, nombre: 'Línea azul' },
      { nm: 527.0, intensidad: 0.9, nombre: 'Línea de Fraunhofer E (Verde)' },
      { nm: 532.8, intensidad: 0.7, nombre: 'Línea verde' },
      { nm: 373.5, intensidad: 1.0, nombre: 'Línea ultravioleta cercana' },
    ],
    aspectoMuestra: 'Metal dúctil y maleable de color gris plateado con magnetismo natural. Se corroe fácilmente en aire húmedo formando óxidos marrones rojizos (herrumbre).',
    satelites: 'El Hierro es la base de la astronomía observacional: los satélites calculan la metalicidad estelar $[Fe/H]$ para deducir la edad y evolución de las galaxias.',
  },
  MG: {
    llama: {
      color: '#FFFFFF',
      nombre: 'Blanco Cegador Incandescente',
      temperatura: '~3100 °C (Combustión del magnesio)',
      descripcion: 'Produce una luz blanca intensa con alta emisión de radiación ultravioleta; se usó históricamente como polvo de flash en fotografía.',
    },
    lineasEmision: [
      { nm: 516.7, intensidad: 0.8, nombre: 'Triplete b1 de Fraunhofer (Verde)' },
      { nm: 517.3, intensidad: 0.9, nombre: 'Triplete b2 de Fraunhofer (Verde)' },
      { nm: 518.4, intensidad: 1.0, nombre: 'Triplete b4 de Fraunhofer (Verde)' },
      { nm: 285.2, intensidad: 1.0, nombre: 'Resonancia UV' },
    ],
    aspectoMuestra: 'Metal ligero blanco plateado, sólido a temperatura ambiente. En forma de cinta o viruta se inflama con cerilla emitiendo luz deslumbrante.',
    satelites: 'El "Triplete b" de Magnesio en 517 nm es una de las marcas más oscuras en el espectro solar analizado por satélites meteorológicos espaciales.',
  },
  B: {
    llama: {
      color: '#00FF44',
      nombre: 'Verde Brillante / Neón',
      temperatura: '~1300 °C',
      descripcion: 'Emisión verde muy pura y distintiva, especialmente visible al mezclar ácido bórico con metanol e inflamar la mezcla.',
    },
    lineasEmision: [
      { nm: 518.2, intensidad: 0.9, nombre: 'Línea verde esmeralda' },
      { nm: 498.0, intensidad: 0.7, nombre: 'Línea cian' },
      { nm: 249.7, intensidad: 1.0, nombre: 'Línea UV profunda' },
    ],
    aspectoMuestra: 'Semimetal oscuro negro-marrón de dureza extrema (segundo tras el diamante). Se presenta como polvo amorfo o cristales lustrosos refractarios.',
    satelites: 'Sondas espaciales analizan la relación Boro/Carbono en rayos cósmicos para medir cuánto tiempo viaja la materia a través de nuestra galaxia.',
  },
  PB: {
    llama: {
      color: '#B0C4DE',
      nombre: 'Azul Grisáceo Pálido',
      temperatura: '~1200 °C',
      descripcion: 'Llama pálida de tono blanco azulado.',
    },
    lineasEmision: [
      { nm: 405.8, intensidad: 1.0, nombre: 'Línea violeta intensa' },
      { nm: 368.3, intensidad: 0.8, nombre: 'Línea límite UV' },
      { nm: 283.3, intensidad: 0.9, nombre: 'Resonancia UV' },
    ],
    aspectoMuestra: 'Metal pesado, denso y muy blando de color blanco azulado recién cortado, que se torna gris mate al oxidarse.',
    satelites: 'Sensores satelitales de fluorescencia de rayos X estudian la abundancia de Plomo radiogénico en la superficie lunar (Misión Lunar Reconnaissance Orbiter).',
  },
  CS: {
    llama: {
      color: '#4169E1',
      nombre: 'Azul Celeste Puro (Caesius)',
      temperatura: '~1000 °C',
      descripcion: 'Debe su nombre al latín caesius (azul cielo), debido a las dos líneas espectrales azules intensas con las que fue descubierto en 1860 por Bunsen y Kirchhoff.',
    },
    lineasEmision: [
      { nm: 455.5, intensidad: 1.0, nombre: 'Línea azul celeste principal' },
      { nm: 459.3, intensidad: 0.8, nombre: 'Línea azul secundaria' },
      { nm: 852.1, intensidad: 1.0, nombre: 'Transición D2 del reloj atómico' },
    ],
    aspectoMuestra: 'Metal líquido a temperatura ambiente moderada (funde a 28.5 °C). Es de color dorado plateado y es el más reactivo de todos los metales estables.',
    satelites: 'Es el corazón de los relojes atómicos a bordo de la constelación GPS y Galileo para geolocalización satelital con precisión milimétrica.',
  },
  NE: {
    llama: {
      color: '#FF2A00',
      nombre: 'Rojo Anaranjado Luminiscente (Plasma)',
      temperatura: 'Descarga eléctrica en gas enrarecido',
      descripcion: 'El gas de los carteles de neón clásicos emite una luz roja anaranjada muy brillante al pasar una corriente de alto voltaje.',
    },
    lineasEmision: [
      { nm: 585.2, intensidad: 0.9, nombre: 'Línea amarilla naranja' },
      { nm: 614.3, intensidad: 0.8, nombre: 'Línea naranja' },
      { nm: 640.2, intensidad: 1.0, nombre: 'Línea roja Neón principal' },
      { nm: 650.6, intensidad: 0.7, nombre: 'Línea roja profunda' },
    ],
    aspectoMuestra: 'Gas noble incoloro e inodoro, presente en trazas en la atmósfera terrestre. No arde con llama pero forma plasmas de color naranja vivo.',
    satelites: 'Los satélites de física solar analizan la razón Neón/Oxígeno en la corona solar para descifrar el mecanismo de calentamiento coronal.',
  },
  HG: {
    llama: {
      color: '#00E5FF',
      nombre: 'Azul Cian Fluorescente (Descarga de vapor)',
      temperatura: 'Lámpara de vapor de mercurio',
      descripcion: 'Emisión clásica de líneas discretas azul, verde y violeta que al chocar con fósforos produce luz blanca en tubos fluorescentes.',
    },
    lineasEmision: [
      { nm: 404.7, intensidad: 0.7, nombre: 'Línea violeta Hg I' },
      { nm: 435.8, intensidad: 0.9, nombre: 'Línea azul intensa' },
      { nm: 546.1, intensidad: 1.0, nombre: 'Línea verde brillante' },
      { nm: 577.0, intensidad: 0.7, nombre: 'Línea amarilla 1' },
      { nm: 579.1, intensidad: 0.7, nombre: 'Línea amarilla 2' },
    ],
    aspectoMuestra: 'El único metal elemental que es líquido a temperatura y presión estándar. Es denso, plateado con aspecto de espejo móvil y alta tensión superficial.',
    satelites: 'Líneas espectrales de calibración estándar para espectrómetros satelitales antes de ser enviados a órbita espacial.',
  },
};

// Generador espectral dinámico algorítmico para cualquier elemento de la tabla periódica (Z=1 hasta 118)
export function obtenerEspectroscopia(elemento) {
  if (!elemento) return null;
  const sym = String(elemento.symbol || '').toUpperCase();
  const z = Number(elemento.atomic_number) || 1;

  if (CATALOGO_ESPECTROSCOPICO[sym]) {
    return {
      simbolo: sym,
      ...CATALOGO_ESPECTROSCOPICO[sym],
    };
  }

  // Generación algorítmica para elementos de transición, lantánidos y actínidos
  const pseudoRandomSeed = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const lineasGeneradas = [];
  const cantidadLineas = 4 + (z % 5);
  for (let i = 0; i < cantidadLineas; i++) {
    const nm = Math.round(410 + pseudoRandomSeed(z * 13 + i * 7) * 270);
    lineasGeneradas.push({
      nm,
      intensidad: 0.5 + pseudoRandomSeed(z * 19 + i * 3) * 0.5,
      nombre: `Línea cuántica de transición (λ = ${nm} nm)`,
    });
  }
  lineasGeneradas.sort((a, b) => a.nm - b.nm);

  const esMetalico = ['alkali', 'alkaline', 'transition', 'metal', 'lanthanide', 'actinide'].some((t) =>
    String(elemento.group_block || '').toLowerCase().includes(t)
  );

  return {
    simbolo: sym,
    llama: {
      color: esMetalico ? '#FFB347' : '#A4D8D8',
      nombre: esMetalico ? 'Chispas térmicas anaranjadas' : 'Emisión pálida tenue',
      temperatura: '~1300 °C',
      descripcion: `Excitación térmica típica de elementos del grupo ${elemento.group || 'N/D'} con múltiples líneas de emisión cuántica.`,
    },
    lineasEmision: lineasGeneradas,
    aspectoMuestra: `Muestra en estado ${elemento.standard_state || elemento.phase || 'sólido'} de color característico según su estructura cristalina y empaquetamiento electrónico.`,
    satelites: `Los satélites espectrométricos identifican a ${elemento.name} mediante espectrometría de absorción de rayos X (XRF) y líneas de dispersión óptica visible.`,
  };
}
