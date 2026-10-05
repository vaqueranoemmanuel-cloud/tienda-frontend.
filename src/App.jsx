import React from 'react';
import ListaVentas from './components/ListaVentas';
import FormularioVenta from './components/FormularioVenta';

function App() {
return (
<div>
<h1>Cafetería Escolar</h1>
<FormularioVenta />
<ListaVentas />
</div>
);
}

import React from 'react';
import './index.css'; // O el nombre de tu archivo CSS

function App() {
  return (
    <div className="main-container">
      
      {/* TÍTULO PRINCIPAL */}
      <header className="header-title">
        <h1>Cafetería <span>Escolar</span></h1>
      </header>

      {/* CONTENEDOR EN 2 COLUMNAS */}
      <div className="content-grid">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <section className="card-form">
          <h2 className="card-title">Registrar Nueva Venta</h2>
          
          {/* Aquí van tus inputs y selects con la clase "form-control" */}
          <select className="form-control">
            <option value="">Seleccione estudiante</option>
          </select>

          <select className="form-control">
            <option value="">Seleccione producto</option>
          </select>

          <input type="number" className="form-control" placeholder="Cantidad" />
          <input type="date" className="form-control" />

          <button type="submit" className="btn-submit">
            Registrar Venta
          </button>
        </section>

        {/* COLUMNA DERECHA: TABLA + IMAGEN */}
        <section className="right-section">
          
          <div className="table-and-image-wrapper">
            
            {/* TABLA DE VENTAS */}
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Aquí mapeas tus ventas traídas de Render */}
                </tbody>
              </table>
            </div>

            {/* IMAGEN AL LADO DE LA TABLA */}
            <div className="side-image-container">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" 
                alt="Comida Cafetería" 
              />
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

useEffect(() => {
  // Cargar estudiantes
  fetch(`${API_URL}/estudiantes`)
    .then((res) => {
      if (!res.ok) throw new Error('Error en la red');
      return res.json();
    })
    .then((data) => setEstudiantes(data))
    .catch((err) => console.error('Error al obtener estudiantes:', err));

  // Cargar productos
  fetch(`${API_URL}/productos`)
    .then((res) => {
      if (!res.ok) throw new Error('Error en la red');
      return res.json();
    })
    .then((data) => setProductos(data))
    .catch((err) => console.error('Error al obtener productos:', err));
}, []);


export default App;