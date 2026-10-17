// Utilidades fisicoquímicas para laboratorio: cálculo de capas electrónicas (Bohr) y diamante NFPA 704

// Capacidad máxima de capas según el principio de Aufbau aproximado
export const calcularCapasElectronicas = (numeroAtomico) => {
  const z = Number(numeroAtomico) || 1;
  const configuraciones = [
    { capa: 'K (n=1)', max: 2 },
    { capa: 'L (n=2)', max: 8 },
    { capa: 'M (n=3)', max: 18 },
    { capa: 'N (n=4)', max: 32 },
    { capa: 'O (n=5)', max: 32 },
    { capa: 'P (n=6)', max: 18 },
    { capa: 'Q (n=7)', max: 8 },
  ];

  let restantes = z;
  const resultado = [];

  for (let i = 0; i < configuraciones.length && restantes > 0; i++) {
    const config = configuraciones[i];
    // Asignación aproximada para visualización gráfica
    let electrones = 0;
    if (i === 0) electrones = Math.min(2, restantes);
    else if (i === 1) electrones = Math.min(8, restantes);
    else if (i === 2) electrones = Math.min(restantes <= 8 ? restantes : restantes <= 10 ? 8 : Math.min(18, restantes), restantes);
    else electrones = Math.min(config.max, restantes);

    resultado.push({ capa: config.capa, electrones });
    restantes -= electrones;
  }

  return resultado;
};

// Estimación de niveles del diamante NFPA 704 de acuerdo a familia y bloque
export const calcularNFPA704 = (elemento) => {
  if (!elemento) return { salud: 0, inflamabilidad: 0, reactividad: 0, especial: '' };
  
  const grupo = Number(elemento.group);
  const simbolo = String(elemento.symbol || '').toUpperCase();
  const fase = String(elemento.standard_state || elemento.phase || '').toLowerCase();

  // Valores pre-calibrados para elementos notables
  if (simbolo === 'H') return { salud: 0, inflamabilidad: 4, reactividad: 0, especial: '' };
  if (simbolo === 'O') return { salud: 0, inflamabilidad: 0, reactividad: 0, especial: 'OX' };
  if (simbolo === 'NA' || simbolo === 'K' || simbolo === 'LI') return { salud: 3, inflamabilidad: 3, reactividad: 2, especial: '<s>W</s>' };
  if (simbolo === 'CL') return { salud: 4, inflamabilidad: 0, reactividad: 0, especial: 'OX' };
  if (simbolo === 'F') return { salud: 4, inflamabilidad: 0, reactividad: 4, especial: 'OX' };
  if (simbolo === 'U' || simbolo === 'PU' || simbolo === 'TH') return { salud: 3, inflamabilidad: 1, reactividad: 2, especial: 'RAD' };
  if (simbolo === 'P') return { salud: 3, inflamabilidad: 4, reactividad: 2, especial: '' };
  if (simbolo === 'HE' || simbolo === 'NE' || simbolo === 'AR' || simbolo === 'KR' || simbolo === 'XE' || simbolo === 'RN') {
    return { salud: 0, inflamabilidad: 0, reactividad: 0, especial: '' };
  }

  // Estimación algorítmica por grupo
  let salud = 1;
  let inflamabilidad = 0;
  let reactividad = 0;
  let especial = '';

  if (grupo === 1) { // Alcalinos
    salud = 3;
    inflamabilidad = 3;
    reactividad = 2;
    especial = '<s>W</s>';
  } else if (grupo === 2) { // Alcalinotérreos
    salud = 2;
    inflamabilidad = 2;
    reactividad = 1;
  } else if (grupo === 17) { // Halógenos
    salud = 3;
    inflamabilidad = 0;
    reactividad = 1;
    especial = 'OX';
  } else if (grupo === 18) { // Gases nobles
    salud = 0;
    inflamabilidad = 0;
    reactividad = 0;
  } else if (fase === 'gas') {
    inflamabilidad = 2;
  }

  return { salud, inflamabilidad, reactividad, especial };
};

// Conversión de Kelvin a Celsius formateada
export const kelvinACelsius = (k) => {
  if (!k || isNaN(k)) return 'N/D';
  return `${(Number(k) - 273.15).toFixed(1)} °C`;
};
