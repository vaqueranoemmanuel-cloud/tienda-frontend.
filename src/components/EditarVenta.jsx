import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditarVenta({ venta, onUpdate }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estado del formulario inicializado con los datos de la venta actual
  const [formData, setFormData] = useState({
    estudiante_id: venta ? venta.estudiante_id : '',
    producto_id: venta ? venta.producto_id : '',
    cantidad: venta ? venta.cantidad : '',
    fecha: venta ? venta.fecha : ''
  });

  useEffect(() => {
    // Si la venta cambia, actualizamos el estado del formulario
    if (venta) {
      setFormData({
        estudiante_id: venta.estudiante_id || '',
        producto_id: venta.producto_id || '',
        cantidad: venta.cantidad || '',
        fecha: venta.fecha ? venta.fecha.split('T')[0] : ''
      });
    }

    // Cargar listas desde Render
    axios.get('https://tienda-backend-5ilt.onrender.com/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => console.error(err));

    axios.get('https://tienda-backend-5ilt.onrender.com/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, [venta]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://tienda-backend-5ilt.onrender.com/ventas/${venta.id}`, formData)
      .then(res => {
        alert(res.data.message || 'Venta actualizada con éxito');
        if (onUpdate) onUpdate();
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
      <select 
        name="estudiante_id" 
        value={formData.estudiante_id} 
        onChange={handleChange}
        required
      >
        <option value="">Seleccione estudiante</option>
        {estudiantes.map(e => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>

      <select 
        name="producto_id" 
        value={formData.producto_id} 
        onChange={handleChange}
        required
      >
        <option value="">Seleccione producto</option>
        {productos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <input 
        type="number" 
        name="cantidad" 
        value={formData.cantidad} 
        onChange={handleChange} 
        placeholder="Cantidad"
        required 
      />

      <input 
        type="date" 
        name="fecha" 
        value={formData.fecha} 
        onChange={handleChange} 
        required 
      />

      <button type="submit">Actualizar Venta</button>
    </form>
  );
}

export default EditarVenta;