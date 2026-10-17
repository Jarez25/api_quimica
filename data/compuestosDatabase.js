// Base de conocimiento fisicoquímico y estequiométrico de especies moleculares, radicales e iones
export const compuestosDatabase = {
  // === Sistema Hidrógeno - Oxígeno ===
  'H2O1': {
    posible: true,
    resultado: 'H2O',
    nombre: 'Agua (Monóxido de dihidrógeno)',
    formula_html: 'H<sub>2</sub>O',
    tipo_especie: 'Molécula neutra dipolar estable',
    descripcion: 'Configuración estequiométrica clásica y termodinámicamente más favorable entre hidrógeno y oxígeno. Cada átomo de hidrógeno comparte un par de electrones con el oxígeno, completando el octeto con dos pares solitarios. Presenta enlace covalente polar con una fuerte red tridimensional de puentes de hidrógeno.',
    geometria_molecular: 'Angular (104.45°)',
    momento_dipolar: '1.85 Debye',
    entalpia_formacion: '-285.8 kJ/mol (líquido)',
    estabilidad: 'Excepcionalmente alta (Estable)',
    nivel_peligro: 'bajo',
    riesgos: ['Inofensivo en condiciones normales', 'Riesgo de asfixia mecánica por inmersión'],
    advertencia_seguridad: 'Sustancia estándar de referencia para disolventes de laboratorio. Compatible con la gran mayoría de reactivos excepto metales alcalinos puros (Na, K, Li).',
    componentes: [
      { elemento: 'H', nombre: 'Hidrógeno', cantidad: 2 },
      { elemento: 'O', nombre: 'Oxígeno', cantidad: 1 },
    ],
    comparacion_contextual: 'A diferencia de HO• (radical oxidante) o H3O+ (catión ácido), H2O posee capa electrónica cerrada sin carga neta, siendo el estado fundamental en equilibrio a 298 K.',
    sugerencias_seguras: ['H2O2 (Peróxido de hidrógeno)', 'HO• (Radical hidroxilo)', 'H3O+ (Ion hidronio)'],
    nota: 'Punto de ebullición anómalamente alto (100 °C a 1 atm) debido a la cohesión por puentes de hidrógeno.',
  },

  'H1O1': {
    posible: true,
    resultado: 'HO•',
    nombre: 'Radical Hidroxilo (Monóxido de monohidrógeno radical)',
    formula_html: 'HO<sup>•</sup>',
    tipo_especie: 'Radical libre neutro de alta reactividad',
    descripcion: 'Al seleccionar una relación estequiométrica 1:1 entre H y O, se genera el radical hidroxilo (HO•), que posee 7 electrones de valencia y un electrón desapareado sobre el átomo de oxígeno. No es un compuesto aislable en frasco a temperatura ambiente; tiene un tiempo de vida media inferior a 1 microsegundo antes de abstraer un átomo de hidrógeno para formar H2O o dimerizar en H2O2.',
    geometria_molecular: 'Lineal diatómica (enlace O-H: 97 pm)',
    momento_dipolar: '1.66 Debye',
    entalpia_formacion: '+39.3 kJ/mol (endotérmico/reactivo)',
    estabilidad: 'Extremadamente inestable (Radical libre transitorio)',
    nivel_peligro: 'alto',
    riesgos: ['Agente oxidante celular agresivo', 'Inductor de peroxidación lipídica y daño en ADN'],
    advertencia_seguridad: 'Considerado el "detergente de la atmósfera terrestre" y una de las especies reactivas de oxígeno (ROS) más dañinas en biología molecular.',
    componentes: [
      { elemento: 'H', nombre: 'Hidrógeno', cantidad: 1 },
      { elemento: 'O', nombre: 'Oxígeno', cantidad: 1 },
    ],
    comparacion_contextual: 'Mientras que el anión hidróxido (OH-) tiene carga negativa y capa cerrada, y el agua (H2O) tiene 2 hidrógenos, HO• tiene un electrón libre que lo hace un oxidante fulminante.',
    sugerencias_seguras: ['H2O (Agua estable)', 'H2O2 (Peróxido de hidrógeno con 2 oxígenos)'],
    nota: 'Se detecta comúnmente en la troposfera y en procesos de radiólisis del agua en reactores nucleares.',
  },

  'H3O1': {
    posible: true,
    resultado: 'H3O+',
    nombre: 'Ion Hidronio (Oxonio catiónico)',
    formula_html: 'H<sub>3</sub>O<sup>+</sup>',
    tipo_especie: 'Catión poliatómico en fase acuosa',
    descripcion: 'Al añadir un protón extra a la molécula de agua (relación 3H:1O), el par solitario del oxígeno coordina con el protón H+ formando un enlace dativo. La especie resultante H3O+ tiene carga neta +1 y es el verdadero portador de la acidez en soluciones acuosas de Brønsted-Lowry. Como gas neutro libre es inestable, pero en solución acuosa se estabiliza mediante complejos de solvatación como el catión de Zundel [H5O2]+ y el catión de Eigen [H9O4]+.',
    geometria_molecular: 'Piramidal trigonal (ángulo H-O-H: ~113°)',
    momento_dipolar: 'Especie iónica apantallada',
    entalpia_formacion: 'Afinidad protónica del agua: ~691 kJ/mol',
    estabilidad: 'Muy estable en disolución ácida / Requiere contraión (Cl-, SO4^2-)',
    nivel_peligro: 'medio',
    riesgos: ['Corrosivo en altas concentraciones (pH bajo)', 'Irritante severo para mucosas'],
    advertencia_seguridad: 'Manipular soluciones ricas en H3O+ (ácidos minerales como HCl o H2SO4) en campana de extracción de gases y con guantes de nitrilo y gafas de protección.',
    componentes: [
      { elemento: 'H', nombre: 'Hidrógeno', cantidad: 3 },
      { elemento: 'O', nombre: 'Oxígeno', cantidad: 1 },
    ],
    comparacion_contextual: 'A diferencia del agua neutra (H2O), H3O+ posee una deficiencia electrónica formal de un electrón (+1) y geometría piramidal análoga a la del amoníaco (NH3).',
    sugerencias_seguras: ['H2O (Disolvente neutro sin carga)', 'NH4+ (Ion análogo isoelectrónico)'],
    nota: 'Es la especie responsable del valor de pH en la fórmula clásica: pH = -log10[H3O+].',
  },

  'H2O2': {
    posible: true,
    resultado: 'H2O2',
    nombre: 'Peróxido de Hidrógeno (Agua oxigenada)',
    formula_html: 'H<sub>2</sub>O<sub>2</sub>',
    tipo_especie: 'Molécula neutra peroxidada',
    descripcion: 'Compuesto que contiene un enlace covalente simple oxígeno-oxígeno (-O-O-), donde el oxígeno presenta estado de oxidación inusual de -1. Presenta conformación no planar "abierta tipo libro". Es un potente desinfectante y agente oxidante que se descompone exotérmicamente en agua y oxígeno gaseoso.',
    geometria_molecular: 'Conformación no planar torcida (ángulo diedro ~111°)',
    momento_dipolar: '2.26 Debye',
    entalpia_formacion: '-187.8 kJ/mol',
    estabilidad: 'Termodinámicamente metaestable (se descompone catalíticamente)',
    nivel_peligro: 'medio',
    riesgos: ['Comburente en concentraciones >30%', 'Blanqueamiento y quemaduras químicas en piel', 'Riesgo de sobrepresión si se sella con catalizadores metálicos'],
    advertencia_seguridad: 'Almacenar en recipientes oscuros ventilados con agentes estabilizantes para evitar la descomposición fotoquímica inducida por luz ultravioleta.',
    componentes: [
      { elemento: 'H', nombre: 'Hidrógeno', cantidad: 2 },
      { elemento: 'O', nombre: 'Oxígeno', cantidad: 2 },
    ],
    comparacion_contextual: 'A diferencia del agua (H2O), el peróxido tiene un puente -O-O- relativamente débil (energía de disociación ~210 kJ/mol) que libera oxígeno libre activo al romperse.',
    sugerencias_seguras: ['H2O (Producto final de descomposición limpia)'],
    nota: 'En concentraciones del 70% al 90% (High-Test Peroxide) se utiliza como monopropelente aeroespacial.',
  },

  // === Sistema Carbono - Oxígeno ===
  'C1O1': {
    posible: true,
    resultado: 'CO',
    nombre: 'Monóxido de Carbono',
    formula_html: 'CO',
    tipo_especie: 'Molécula diatómica con triple enlace',
    descripcion: 'Gas incoloro, inodoro e insípido formado por la combustión incompleta de hidrocarburos. El enlace C≡O consta de dos enlaces covalentes y un enlace covalente coordinado (dativo), con una de las energías de enlace más altas conocidas en química (1072 kJ/mol).',
    geometria_molecular: 'Lineal diatómica (112.8 pm)',
    momento_dipolar: '0.122 Debye',
    entalpia_formacion: '-110.5 kJ/mol',
    estabilidad: 'Estable a temperatura ambiente / Reductor a altas temperaturas',
    nivel_peligro: 'alto',
    riesgos: ['Letal por asfixia química', 'Afinidad con hemoglobina 200 veces superior al O2', 'Gas inflamable'],
    advertencia_seguridad: 'Peligro invisible. Requiere detectores electroquímicos de CO en áreas de calderas y laboratorios. La exposición a >1000 ppm provoca pérdida de conciencia en minutos.',
    componentes: [
      { elemento: 'C', nombre: 'Carbono', cantidad: 1 },
      { elemento: 'O', nombre: 'Oxígeno', cantidad: 1 },
    ],
    comparacion_contextual: 'A diferencia del CO2 (que es el producto de combustión completa y no letal en bajas concentraciones), el CO bloquea irreversiblemente el transporte de oxígeno en eritrocitos.',
    sugerencias_seguras: ['CO2 (Dióxido de carbono oxidado completamente)'],
    nota: 'Ligando clásico en química de coordinación (complejos carbonilo metálicos de campo fuerte).',
  },

  'C1O2': {
    posible: true,
    resultado: 'CO2',
    nombre: 'Dióxido de Carbono (Anhídrido carbónico)',
    formula_html: 'CO<sub>2</sub>',
    tipo_especie: 'Molécula neutra apolar lineal',
    descripcion: 'Molécula lineal formada por dos dobles enlaces carbono-oxígeno (O=C=O). A pesar de la polaridad individual de cada enlace C=O, la simetría centrosimétrica lineal cancela los momentos dipolares, resultando en una molécula apolar.',
    geometria_molecular: 'Lineal (180°)',
    momento_dipolar: '0.00 Debye (apolar por simetría)',
    entalpia_formacion: '-393.5 kJ/mol (muy exotérmico)',
    estabilidad: 'Extremadamente alta (pozo termodinámico de combustión)',
    nivel_peligro: 'bajo',
    riesgos: ['Asfixiante simple a concentraciones >5%', 'Sublimación rápida de hielo seco con quemaduras por frío'],
    advertencia_seguridad: 'Trabajar en áreas ventiladas si se maneja hielo seco o cilindros presurizados para evitar desplazamientos de oxígeno.',
    componentes: [
      { elemento: 'C', nombre: 'Carbono', cantidad: 1 },
      { elemento: 'O', nombre: 'Oxígeno', cantidad: 2 },
    ],
    comparacion_contextual: 'El CO2 tiene los dos enlaces saturados con oxígeno, siendo químicamente inerte frente a oxidaciones adicionales a diferencia del monóxido de carbono (CO).',
    sugerencias_seguras: ['CO (Requiere precauciones extremas)', 'H2CO3 (Ácido carbónico en solución acuosa)'],
    nota: 'Punto triple a 5.1 atm y -56.6 °C; a presión atmosférica estándar sublima directamente a -78.5 °C sin pasar por fase líquida.',
  },

  // === Sistema Nitrógeno - Hidrógeno ===
  'H3N1': {
    posible: true,
    resultado: 'NH3',
    nombre: 'Amoníaco (Trihidruro de nitrógeno)',
    formula_html: 'NH<sub>3</sub>',
    tipo_especie: 'Base de Lewis piramidal neutra',
    descripcion: 'Gas incoloro con olor sofocante y penetrante. El átomo de nitrógeno sp3 contiene un par de electrones no enlazantes que le confiere propiedades básicas y de nucleófilo fuerte. Es la base de toda la industria de fertilizantes nitrogenados sintetizada mediante el proceso Haber-Bosch.',
    geometria_molecular: 'Piramidal trigonal (107.8° con inversión cuántica)',
    momento_dipolar: '1.42 Debye',
    entalpia_formacion: '-45.9 kJ/mol',
    estabilidad: 'Alta a 298 K / Descompone a >450 °C',
    nivel_peligro: 'medio',
    riesgos: ['Gas tóxico por inhalación', 'Corrosivo para ojos y vías respiratorias', 'Peligroso para el medio ambiente acuático'],
    advertencia_seguridad: 'Usar campana de extracción de gases obligatoria. Jamás mezclar con hipoclorito de sodio (lejía/cloro) ya que genera cloramidas tóxicas explosivas.',
    componentes: [
      { elemento: 'N', nombre: 'Nitrógeno', cantidad: 1 },
      { elemento: 'H', nombre: 'Hidrógeno', cantidad: 3 },
    ],
    comparacion_contextual: 'Al protonarse con un cuarto hidrógeno se convierte en el ion amonio (NH4+), un catión no volátil y no tóxico.',
    sugerencias_seguras: ['NH4+ (Ion amonio salino)', 'N2H4 (Hidracina)'],
    nota: 'Experimenta inversión de pirámide (efecto túnel cuántico) a una frecuencia de 24 GHz, histórico en el primer máser atómico.',
  },

  'H4N1': {
    posible: true,
    resultado: 'NH4+',
    nombre: 'Ion Amonio (Catión tetraédrico)',
    formula_html: 'NH<sub>4</sub><sup>+</sup>',
    tipo_especie: 'Catión poliatómico de simetría tetraédrica',
    descripcion: 'Formado por la adición de un protón (H+) al par solitario del amoníaco (NH3 + H+ -> NH4+). Posee hibridación sp3 perfecta con 4 enlaces N-H equivalentes gracias a la deslocalización de la carga positiva entre los cuatro núcleos de hidrógeno.',
    geometria_molecular: 'Tetraédrica perfecta (109.5°)',
    momento_dipolar: '0.00 Debye (simetría Td)',
    entalpia_formacion: 'Afinidad protónica del NH3: ~853 kJ/mol',
    estabilidad: 'Muy estable en sales iónicas (ej. NH4Cl, (NH4)2SO4)',
    nivel_peligro: 'bajo',
    riesgos: ['Irritación leve en contacto prolongado con sales concentradas'],
    advertencia_seguridad: 'Las sales de amonio son seguras en disolución acuosa. En presencia de bases fuertes regeneran amoníaco gaseoso.',
    componentes: [
      { elemento: 'N', nombre: 'Nitrógeno', cantidad: 1 },
      { elemento: 'H', nombre: 'Hidrógeno', cantidad: 4 },
    ],
    comparacion_contextual: 'A diferencia del amoníaco neutro volátil y cáustico (NH3), el catión NH4+ se comporta en disolución de manera similar a los iones de metales alcalinos como K+.',
    sugerencias_seguras: ['NH3 (Gas amoníaco desprotonado)'],
    nota: 'Componente esencial de la bioquímica celular en el ciclo de la urea y metabolismo de aminoácidos.',
  },

  // === Sistema Sodio - Cloro ===
  'Cl1Na1': {
    posible: true,
    resultado: 'NaCl',
    nombre: 'Cloruro de Sodio (Sal de mesa / Halita)',
    formula_html: 'NaCl',
    tipo_especie: 'Sólido cristalino con red iónica',
    descripcion: 'Compuesto iónico arquetípico formado por transferencia completa de un electrón desde el metal alcalino electropositivo Na (3s1) al halógeno electronegativo Cl (3p5), formando iones Na+ y Cl- empaquetados en una red cúbica centrada en las caras (FCC).',
    geometria_molecular: 'Red tridimensional octaédrica (coordinación 6:6)',
    momento_dipolar: '9.0 Debye (par de vapor)',
    entalpia_formacion: '-411.2 kJ/mol (energía de red: -787 kJ/mol)',
    estabilidad: 'Extremadamente alta (Sólido cristalino refractario)',
    nivel_peligro: 'bajo',
    riesgos: ['No tóxico en dosis normales', 'Corrosivo para metales ferrosos en presencia de humedad'],
    advertencia_seguridad: 'Manejo no peligroso. En disolución acuosa es un electrolito fuerte con conductividad eléctrica alta.',
    componentes: [
      { elemento: 'Na', nombre: 'Sodio', cantidad: 1 },
      { elemento: 'Cl', nombre: 'Cloro', cantidad: 1 },
    ],
    comparacion_contextual: 'A pesar de que el sodio metálico arde en contacto con agua y el cloro gas es letal, su unión iónica produce uno de los compuestos más inocuos y vitales del planeta.',
    sugerencias_seguras: ['KCl (Cloruro de potasio análogo)', 'NaF (Fluoruro de sodio)'],
    nota: 'Punto de fusión de 801 °C y punto de ebullición de 1465 °C debido a la enorme energía reticular de la red cristalina.',
  },

  // === Sistema Hidrógeno - Azufre - Oxígeno ===
  'H2O4S1': {
    posible: true,
    resultado: 'H2SO4',
    nombre: 'Ácido Sulfúrico (Aceite de vitriolo)',
    formula_html: 'H<sub>2</sub>SO<sub>4</sub>',
    tipo_especie: 'Ácido mineral diprótico fuerte',
    descripcion: 'Líquido aceitoso denso e incoloro. Es un ácido diprótico fuerte, oxidante enérgico y agente deshidratante extremo. Al disolverse en agua libera una inmensa cantidad de energía de hidratación exotérmica. Es el producto químico de mayor tonelaje producido a nivel mundial.',
    geometria_molecular: 'Tetraédrica distorsionada sobre el azufre central',
    momento_dipolar: '2.72 Debye',
    entalpia_formacion: '-814.0 kJ/mol (líquido)',
    estabilidad: 'Muy estable a temperatura ambiente / Descompone a >300 °C en SO3 y H2O',
    nivel_peligro: 'alto',
    riesgos: ['Cáustico y extremadamente corrosivo', 'Destrucción inmediata de tejidos orgánicos por deshidratación', 'Reacción fuertemente exotérmica con agua'],
    advertencia_seguridad: 'REGLA DE ORO DE LABORATORIO: Jamás viertas agua sobre el ácido ("No des de beber al ácido"); siempre agrega el ácido lentamente sobre el agua para disipar el calor y evitar salpicaduras hirvientes.',
    componentes: [
      { elemento: 'H', nombre: 'Hidrógeno', cantidad: 2 },
      { elemento: 'S', nombre: 'Azufre', cantidad: 1 },
      { elemento: 'O', nombre: 'Oxígeno', cantidad: 4 },
    ],
    comparacion_contextual: 'A diferencia del H2SO3 (ácido sulfuroso con 3 oxígenos, que es inestable y reductor), el H2SO4 tiene el azufre en su estado máximo de oxidación (+6).',
    sugerencias_seguras: ['H2S (Gas sulfuro de hidrógeno)', 'H2SO3 (Ácido sulfuroso)'],
    nota: 'Se utiliza como catalizador en refinerías de petróleo y síntesis de polímeros y fertilizantes.',
  },
};

// Generador de clave estequiométrica ordenada canónica (ej. H:2, O:1 -> 'H2O1')
export const generarClaveEstequiometrica = (reactivos) => {
  if (!Array.isArray(reactivos) || reactivos.length === 0) return '';
  const ordenados = [...reactivos]
    .map((r) => ({
      simbolo: String(r.elemento || r.simbolo || r).trim().charAt(0).toUpperCase() + String(r.elemento || r.simbolo || r).slice(1).toLowerCase(),
      cantidad: Number(r.cantidad || 1),
    }))
    .filter((r) => r.simbolo && r.cantidad > 0)
    .sort((a, b) => a.simbolo.localeCompare(b.simbolo));

  return ordenados.map((r) => `${r.simbolo}${r.cantidad}`).join('');
};

// Búsqueda inteligente en base de datos local
export const resolverCompuestoEstequiometrico = (reactivos) => {
  const clave = generarClaveEstequiometrica(reactivos);
  return compuestosDatabase[clave] || null;
};
