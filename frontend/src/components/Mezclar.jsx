import { useEffect, useMemo, useState } from 'react';

function Mezclar() {
  const [elementos, setElementos] = useState([]);
  const [elementosSeleccionados, setElementosSeleccionados] = useState(['', '']);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesandoIA, setProcesandoIA] = useState(false);

  const API_ELEMENTOS = 'http://localhost:3000/elementos';
  const API_MEZCLAR = 'http://localhost:3000/mezclar';

  const MAX_ELEMENTOS = 5;
  const MIN_ELEMENTOS = 2;

  useEffect(() => {
    fetch(API_ELEMENTOS)
      .then((res) => res.json())
      .then((data) => {
        const normalizados = data
          .map((el) => ({
            atomic_number: Number(el.atomic_number || el.number || 0),
            symbol: el.symbol || el.Symbol || '',
            name: el.name || el.nombre || '',
            block: el.block || 'unknown',
            group: el.group || '',
            period: el.period || '',
            phase: el.phase || '',
          }))
          .filter((el) => el.symbol && el.atomic_number)
          .sort((a, b) => a.atomic_number - b.atomic_number);

        setElementos(normalizados);
      })
      .catch((err) => {
        console.error('❌ Error al cargar elementos:', err);
      })
      .finally(() => setCargando(false));
  }, []);

  const getElemento = (symbol) => {
    return elementos.find((el) => el.symbol === symbol);
  };

  const elementosElegidos = useMemo(() => {
    return elementosSeleccionados
      .filter(Boolean)
      .map((symbol) => getElemento(symbol))
      .filter(Boolean);
  }, [elementosSeleccionados, elementos]);

  const actualizarElemento = (index, value) => {
    const copia = [...elementosSeleccionados];
    copia[index] = value;
    setElementosSeleccionados(copia);
    setResultado(null);
  };

  const agregarElemento = () => {
    if (elementosSeleccionados.length >= MAX_ELEMENTOS) return;
    setElementosSeleccionados([...elementosSeleccionados, '']);
    setResultado(null);
  };

  const quitarElemento = (index) => {
    if (elementosSeleccionados.length <= MIN_ELEMENTOS) return;

    const copia = elementosSeleccionados.filter((_, i) => i !== index);
    setElementosSeleccionados(copia);
    setResultado(null);
  };

  const mezclarElementos = async () => {
    const seleccionados = elementosSeleccionados.filter(Boolean);
    const unicos = [...new Set(seleccionados)];

    if (seleccionados.length < MIN_ELEMENTOS) {
      setResultado({
        error: true,
        titulo: 'Selecciona al menos dos elementos',
        mensaje: 'Debes elegir mínimo 2 elementos para realizar la mezcla.',
      });
      return;
    }

    if (unicos.length < MIN_ELEMENTOS) {
      setResultado({
        error: true,
        titulo: 'Elementos repetidos',
        mensaje: 'Selecciona al menos dos elementos diferentes.',
      });
      return;
    }

    if (unicos.length > MAX_ELEMENTOS) {
      setResultado({
        error: true,
        titulo: 'Demasiados elementos',
        mensaje: `Solo puedes mezclar un máximo de ${MAX_ELEMENTOS} elementos.`,
      });
      return;
    }

    try {
      setProcesandoIA(true);
      setResultado(null);

      const res = await fetch(API_MEZCLAR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          elementos: unicos,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la mezcla');
      }

      const primerCompuesto = data.compuestos_posibles?.[0];

      setResultado({
        error: false,
        conocido: data.posible,
        formula:
          primerCompuesto?.formula ||
          data.resultado ||
          unicos.join(''),
        formula_html: primerCompuesto?.formula_html || '',
        nombre: primerCompuesto?.nombre || 'Resultado generado por IA',
        descripcion:
          data.descripcion ||
          primerCompuesto?.descripcion ||
          'Sin descripción disponible.',
        tipo: primerCompuesto?.tipo || 'Análisis químico',
        componentes: primerCompuesto?.componentes || [],
        nivel_peligro: data.nivel_peligro || 'desconocido',
        riesgos: data.riesgos || [],
        advertencia_seguridad: data.advertencia_seguridad || '',
        elementos_similares: data.elementos_similares || [],
        sugerencias_seguras: data.sugerencias_seguras || [],
        compuestos_posibles: data.compuestos_posibles || [],
        nota: data.nota || '',
      });
    } catch (err) {
      console.error('❌ Error al consultar IA:', err);

      setResultado({
        error: true,
        titulo: 'Error al consultar la IA',
        mensaje: err.message,
      });
    } finally {
      setProcesandoIA(false);
    }
  };

  const limpiar = () => {
    setElementosSeleccionados(['', '']);
    setResultado(null);
  };

  const cargarEjemplo = (lista) => {
    setElementosSeleccionados(lista);
    setResultado(null);
  };

  const getBlockStyle = (block) => {
    switch (block) {
      case 's':
        return 'bg-rose-100 text-rose-950 border-rose-300';
      case 'p':
        return 'bg-sky-100 text-sky-950 border-sky-300';
      case 'd':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'f':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-950 border-slate-300';
    }
  };

  const getPeligroClass = (nivel) => {
    switch (nivel) {
      case 'alto':
        return 'text-red-300 bg-red-500/10 border-red-400/30';
      case 'medio':
        return 'text-amber-300 bg-amber-500/10 border-amber-400/30';
      case 'bajo':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30';
      default:
        return 'text-slate-300 bg-white/5 border-white/10';
    }
  };

  const ElementCard = ({ elemento, label, index }) => {
    if (!elemento) {
      return (
        <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Selecciona un elemento
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
          {label}
        </p>

        {elementosSeleccionados.length > MIN_ELEMENTOS && (
          <button
            type="button"
            onClick={() => quitarElemento(index)}
            disabled={procesandoIA}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
            title="Quitar elemento"
          >
            ×
          </button>
        )}

        <div className="mt-4 flex items-center gap-4">
          <div
            className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-3xl border shadow-lg ${getBlockStyle(
              elemento.block
            )}`}
          >
            <span className="text-xs font-bold opacity-70">
              {elemento.atomic_number}
            </span>

            <span className="text-4xl font-black leading-none">
              {elemento.symbol}
            </span>

            <span className="text-[10px] font-black uppercase opacity-70">
              {elemento.block}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              {elemento.name || elemento.symbol}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Grupo {elemento.group || 'N/D'} · Periodo{' '}
              {elemento.period || 'N/D'}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Estado: {elemento.phase || 'No disponible'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SelectElemento = ({ value, index }) => {
    const seleccionadosEnOtros = elementosSeleccionados.filter(
      (item, i) => item && i !== index
    );

    return (
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-bold text-slate-300">
            Elemento {index + 1}
          </label>

          {elementosSeleccionados.length > MIN_ELEMENTOS && (
            <button
              type="button"
              onClick={() => quitarElemento(index)}
              disabled={procesandoIA}
              className="text-xs font-bold text-red-300 transition hover:text-red-200 disabled:opacity-50"
            >
              Quitar
            </button>
          )}
        </div>

        <select
          value={value}
          onChange={(e) => actualizarElemento(index, e.target.value)}
          disabled={procesandoIA}
          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-slate-100 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecciona un elemento</option>

          {elementos.map((el) => (
            <option
              key={`${index}-${el.atomic_number}`}
              value={el.symbol}
              disabled={seleccionadosEnOtros.includes(el.symbol)}
            >
              {el.atomic_number}. {el.name || el.symbol} ({el.symbol})
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            Laboratorio químico con IA
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Mezclador de elementos
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Selecciona entre 2 y 5 elementos químicos. La IA analizará posibles
            compuestos, composición molecular, riesgos y sugerencias educativas
            seguras.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Selecciona los elementos
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Puedes elegir mínimo {MIN_ELEMENTOS} y máximo {MAX_ELEMENTOS}{' '}
                    elementos. La cantidad de átomos la calcula la IA según la
                    fórmula química.
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                  {elementosSeleccionados.filter(Boolean).length} / {MAX_ELEMENTOS}{' '}
                  seleccionados
                </div>
              </div>

              {cargando ? (
                <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-cyan-100">
                  Cargando elementos...
                </div>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {elementosSeleccionados.map((value, index) => (
                    <SelectElemento
                      key={`select-${index}`}
                      value={value}
                      index={index}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={mezclarElementos}
                  disabled={cargando || procesandoIA}
                  className="min-h-[54px] rounded-2xl bg-cyan-500 px-6 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {procesandoIA ? 'Analizando con IA...' : 'Mezclar elementos'}
                </button>

                <button
                  type="button"
                  onClick={agregarElemento}
                  disabled={
                    cargando ||
                    procesandoIA ||
                    elementosSeleccionados.length >= MAX_ELEMENTOS
                  }
                  className="min-h-[54px] rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-6 font-bold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  + Agregar elemento
                </button>

                <button
                  type="button"
                  onClick={limpiar}
                  disabled={procesandoIA}
                  className="min-h-[54px] rounded-2xl border border-white/10 bg-white/10 px-6 font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Limpiar
                </button>
              </div>

              {procesandoIA && (
                <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm font-semibold text-cyan-100">
                  Consultando OpenAI para analizar posibles compuestos,
                  composición molecular, riesgos y sugerencias seguras...
                </div>
              )}
            </div>

            {elementosElegidos.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <p className="mb-5 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                  Elementos seleccionados
                </p>

                <div className="grid gap-5 md:grid-cols-2">
                  {elementosSeleccionados.map((symbol, index) => (
                    <ElementCard
                      key={`card-${index}-${symbol || 'empty'}`}
                      elemento={getElemento(symbol)}
                      label={`Elemento ${index + 1}`}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {resultado && (
              <div
                className={[
                  'rounded-3xl border p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8',
                  resultado.error
                    ? 'border-red-400/30 bg-red-500/10'
                    : 'border-emerald-400/30 bg-emerald-400/10',
                ].join(' ')}
              >
                {resultado.error ? (
                  <>
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-red-300">
                      Aviso
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-white">
                      {resultado.titulo}
                    </h2>

                    <p className="mt-3 text-red-100">{resultado.mensaje}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
                      Resultado de la mezcla
                    </p>

                    <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-start">
                      <div className="flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-3xl border border-emerald-300/30 bg-emerald-300/15 text-center shadow-xl">
                        <span
                          className="text-4xl font-black text-white"
                          dangerouslySetInnerHTML={
                            resultado.formula_html
                              ? { __html: resultado.formula_html }
                              : undefined
                          }
                        >
                          {!resultado.formula_html ? resultado.formula : null}
                        </span>

                        <span className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                          Fórmula
                        </span>
                      </div>

                      <div className="flex-1">
                        <h2 className="text-3xl font-black text-white">
                          {resultado.nombre}
                        </h2>

                        <p className="mt-3 max-w-2xl text-slate-200">
                          {resultado.descripcion}
                        </p>

                        {resultado.componentes?.length > 0 && (
                          <div className="mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                            <p className="font-black text-cyan-200">
                              Composición molecular
                            </p>

                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              {resultado.componentes.map((item, index) => (
                                <div
                                  key={`${item.elemento}-${index}`}
                                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                                >
                                  <p className="text-lg font-black text-white">
                                    {item.cantidad} × {item.elemento}
                                  </p>

                                  <p className="text-xs text-cyan-100/80">
                                    {item.nombre}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs text-slate-400">Tipo</p>

                            <p className="mt-1 font-bold text-white">
                              {resultado.tipo}
                            </p>
                          </div>

                          <div
                            className={[
                              'rounded-2xl border p-4',
                              getPeligroClass(resultado.nivel_peligro),
                            ].join(' ')}
                          >
                            <p className="text-xs opacity-80">
                              Nivel de peligro
                            </p>

                            <p className="mt-1 font-black uppercase">
                              {resultado.nivel_peligro || 'desconocido'}
                            </p>
                          </div>
                        </div>

                        {resultado.advertencia_seguridad && (
                          <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                            <p className="font-black text-red-200">
                              Advertencia de seguridad
                            </p>

                            <p className="mt-1">
                              {resultado.advertencia_seguridad}
                            </p>
                          </div>
                        )}

                        {resultado.riesgos?.length > 0 && (
                          <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                            <p className="font-black text-amber-200">
                              Riesgos generales
                            </p>

                            <ul className="mt-2 list-disc space-y-1 pl-5">
                              {resultado.riesgos.map((riesgo, index) => (
                                <li key={index}>{riesgo}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {resultado.compuestos_posibles?.length > 1 && (
                          <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                            <p className="font-black text-emerald-200">
                              Otros compuestos posibles
                            </p>

                            <div className="mt-3 grid gap-3">
                              {resultado.compuestos_posibles
                                .slice(1)
                                .map((compuesto, index) => (
                                  <div
                                    key={index}
                                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                                  >
                                    <p className="font-black text-white">
                                      {compuesto.formula} - {compuesto.nombre}
                                    </p>

                                    <p className="mt-1 text-sm text-emerald-100/80">
                                      {compuesto.descripcion}
                                    </p>

                                    {compuesto.componentes?.length > 0 && (
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        {compuesto.componentes.map(
                                          (item, itemIndex) => (
                                            <span
                                              key={`${item.elemento}-${itemIndex}`}
                                              className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white"
                                            >
                                              {item.cantidad} × {item.elemento}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {resultado.sugerencias_seguras?.length > 0 && (
                          <div className="mt-4 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                            <p className="font-black text-cyan-200">
                              Sugerencias seguras
                            </p>

                            <ul className="mt-2 list-disc space-y-1 pl-5">
                              {resultado.sugerencias_seguras.map(
                                (sugerencia, index) => (
                                  <li key={index}>{sugerencia}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {resultado.elementos_similares?.length > 0 && (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                            <p className="font-black text-white">
                              Elementos similares o alternativos
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {resultado.elementos_similares.map((el, index) => (
                                <span
                                  key={index}
                                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-slate-200"
                                >
                                  {el}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {resultado.nota && (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                            {resultado.nota}
                          </div>
                        )}

                        {!resultado.conocido && (
                          <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                            Esta combinación no aparece como compuesto conocido
                            principal. La IA puede sugerir alternativas o usos
                            educativos seguros.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-black text-white">
                Ejemplos rápidos
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Prueba combinaciones de 2, 3 o 4 elementos.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  [['H', 'O'], 'Agua', 'H₂O'],
                  [['Na', 'Cl'], 'Sal común', 'NaCl'],
                  [['C', 'O'], 'Dióxido de carbono', 'CO₂'],
                  [['Na', 'H', 'C', 'O'], 'Bicarbonato de sodio', 'NaHCO₃'],
                  [['H', 'S', 'O'], 'Ácido sulfúrico', 'H₂SO₄'],
                  [['C', 'H', 'O'], 'Glucosa / compuestos orgánicos', 'C₆H₁₂O₆'],
                ].map(([lista, nombre, formula]) => (
                  <button
                    key={`${lista.join('-')}-${formula}`}
                    type="button"
                    onClick={() => cargarEjemplo(lista)}
                    disabled={procesandoIA}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>
                      <span className="font-black text-white">
                        {lista.join(' + ')}
                      </span>

                      <span className="block text-xs text-slate-400">
                        {nombre} · {formula}
                      </span>
                    </span>

                    <span className="text-cyan-300">›</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-cyan-100">
              <h3 className="font-black">Nota importante</h3>

              <p className="mt-2 text-sm leading-6 text-cyan-100/80">
                La cantidad de elementos seleccionados no representa la cantidad
                de átomos. Por ejemplo, al elegir H y O, la IA puede devolver
                H₂O, que contiene 2 átomos de hidrógeno y 1 de oxígeno.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 text-amber-100">
              <h3 className="font-black">Límite recomendado</h3>

              <p className="mt-2 text-sm leading-6 text-amber-100/80">
                Para mantener respuestas claras, esta vista permite máximo 5
                elementos por mezcla.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Mezclar;