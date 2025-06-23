// ElementoDetalle.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ElementoDetalle() {
  const { id } = useParams();
  const [elemento, setElemento] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/elementos/atomic_number/${id}`)
      .then(res => res.json())
      .then(data => setElemento(data))
      .catch(err => console.error('❌ Error al cargar el elemento:', err));
  }, [id]);

  if (!elemento) {
    return <p className="p-4">Cargando detalles del elemento...</p>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">
        {elemento.name} ({elemento.symbol})
      </h2>
      <ul className="space-y-2">
        <li><strong>Número atómico:</strong> {elemento.atomic_number}</li>
        <li><strong>Bloque:</strong> {elemento.block}</li>
        <li><strong>Grupo:</strong> {elemento.group}</li>
        <li><strong>Periodo:</strong> {elemento.period}</li>
        <li><strong>Peso atómico:</strong> {elemento.atomic_mass}</li>
        <li><strong>Estado:</strong> {elemento.phase}</li>
        <li><strong>Electronegatividad:</strong> {elemento.electronegativity_pauling}</li>
        {/* Agrega más campos según los datos que recibas */}
      </ul>
    </div>
  );
}

export default ElementoDetalle;
