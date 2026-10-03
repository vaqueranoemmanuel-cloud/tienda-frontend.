import React, { useEffect, useState } from 'react';
import { api } from '../api';
import EditarVenta from './EditarVenta';

function ListaVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const cargarVentas = () => {
    api.get('/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error('Error al obtener ventas:', err));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const eliminarVenta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      api.delete(`/ventas/${id}`)
        .then(res => {
          alert(res.data.message);
          cargarVentas();
        })
        .catch(err => console.error('Error al eliminar venta:', err));
    }
  };

  return (
    <div>
      <h2>Ventas de la Cafetería</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{v.estudiante}</td>
              <td>{v.producto}</td>
              <td>{v.cantidad}</td>
              <td>${v.precio}</td>
              <td>${v.total}</td>
              <td>{v.fecha}</td>
              <td>
                <button onClick={() => setVentaSeleccionada(v)}>Editar</button>
                <button onClick={() => eliminarVenta(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventaSeleccionada && (
        <EditarVenta 
          venta={ventaSeleccionada} 
          onUpdate={() => { 
            setVentaSeleccionada(null); 
            cargarVentas(); 
          }} 
        />
      )}
    </div>
  );
}

<div className="main-container">
  
  {/* ENCABEZADO */}
  <header className="header-title">
    <h1>Cafetería <span>Escolar</span></h1>
  </header>

  {/* GRID PRINCIPAL */}
  <div className="content-grid">
    
    {/* COLUMNA IZQUIERDA: FORMULARIO */}
    <section className="card-form">
      <h2 className="card-title">Registrar Nueva Venta</h2>
      
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

    {/* COLUMNA DERECHA: TABLA Y SU IMAGEN A UN LADO */}
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
              {/* Aquí renderizas la lista de tus ventas */}
            </tbody>
          </table>
        </div>

        {/* IMAGEN AL LADO DE LA TABLA */}
        <div className="side-image-container">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" 
            alt="Cafetería y Alimentos" 
          />
        </div>

      </div>

    </section>

  </div>
</div>

export default ListaVentas;
     