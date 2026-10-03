import React, { useState, useEffect } from 'react';
import axios from 'axios';
function EditarVenta({ venta, onUpdate }) {
const [formData, setFormData] = useState({
estudiante_id: venta.estudiante_id,
producto_id: venta.producto_id,
cantidad: venta.cantidad,
fecha: venta.fecha
});
const [estudiantes, setEstudiantes] = useState([]);
const [productos, setProductos] = useState([]);
useEffect(() => {
axios.get('http://localhost:3000/estudiantes')
.then(res => setEstudiantes(res.data))
.catch(err => console.error(err));
axios.get('http://localhost:3000/productos')
.then(res => setProductos(res.data))
.catch(err => console.error(err));
}, []);
const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value
});
};
const handleSubmit = (e) => {
e.preventDefault();
axios.put(`http://localhost:3000/ventas/${venta.id}`, formData)
.then(res => {
alert(res.data.message);
onUpdate(); // refresca la lista de ventas
})
.catch(err => console.error('Error al actualizar venta:', err));
};
return (
<form onSubmit={handleSubmit}>
<select name="estudiante_id" value={formData.estudiante_id}
onChange={handleChange} required>
{estudiantes.map(e => (
<option key={e.id} value={e.id}>{e.nombre} - {e.grupo}</option>
))}
</select>
<select name="producto_id" value={formData.producto_id}
onChange={handleChange} required>
{productos.map(p => (
<option key={p.id} value={p.id}>{p.nombre} -
${p.precio}</option>
))}
</select>
<input type="number" name="cantidad" value={formData.cantidad}
onChange={handleChange} required />
<input type="date" name="fecha" value={formData.fecha}
onChange={handleChange} required />
<button type="submit">Actualizar Venta</button>
</form>
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
export default EditarVenta;



