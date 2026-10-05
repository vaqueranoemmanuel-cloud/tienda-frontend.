import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioVenta() {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: '',
    fecha: ''
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('https://tienda-backend-5ilt.onrender.com/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => console.error(err));

    axios.get('https://tienda-backend-5ilt.onrender.com/productos')
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

    axios.post('https://tienda-backend-5ilt.onrender.com/ventas', formData)
      .then(res => {
        alert(res.data.message);
        setFormData({
          estudiante_id: '',
          producto_id: '',
          cantidad: '',
          fecha: ''
        });
      })
      .catch(err => console.error('Error al registrar venta:', err));
  };

  return (
    <div>
      <h2>Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit}>
        <select name="estudiante_id" value={formData.estudiante_id} onChange={handleChange} required>
          <option value="">Seleccione estudiante</option>
          {estudiantes.map(e => (
            <option key={e.id} value={e.id}>{e.nombre} - {e.grupo}</option>
          ))}
        </select>

        <select name="producto_id" value={formData.producto_id} onChange={handleChange} required>
          <option value="">Seleccione producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
          ))}
        </select>

        <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} required />
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
        <button type="submit">Registrar Venta</button>
      </form>
    </div>
  );
}

export default FormularioVenta;