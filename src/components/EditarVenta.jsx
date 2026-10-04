import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditarVenta({ venta, onUpdate }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: '',
    fecha: ''
  });

  // 1. Cargar las listas de estudiantes y productos SOLO UNA VEZ al cargar el componente
  useEffect(() => {
    axios.get('https://tienda-backend-5ilt.onrender.com/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => console.error('Error cargando estudiantes:', err));

    axios.get('https://tienda-backend-5ilt.onrender.com/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  // 2. Cargar los datos de la venta seleccionada en el formulario
  useEffect(() => {
    if (venta) {
      setFormData({
        // Convertimos a String para asegurar coincidencia exacta con el <select>
        estudiante_id: venta.estudiante_id ? String(venta.estudiante_id) : '',
        producto_id: venta.producto_id ? String(venta.producto_id) : '',
        cantidad: venta.cantidad !== undefined ? venta.cantidad : '',
        fecha: venta.fecha ? venta.fecha.split('T')[0] : ''
      });
    }
  }, [venta]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!venta || !venta.id) {
      alert("Error: No se seleccionó una venta válida.");
      return;
    }

    axios.put(`https://tienda-backend-5ilt.onrender.com/ventas/${venta.id}`, formData)
      .then(res => {
        alert(res.data.message || 'Venta actualizada con éxito');
        if (onUpdate) {
          onUpdate(); // Notifica al padre (ListaVentas) para refrescar la lista y cerrar la edición
        }
      })
      .catch(err => {
        console.error('Error actualizando venta:', err);
        alert('Ocurrió un error al actualizar la venta');
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
      <select 
        name="estudiante_id" 
        value={formData.estudiante_id} 
        onChange={handleChange}
        required
      >
        <option value="">Seleccione estudiante</option>
        {estudiantes.map(e => (
          <option key={e.id} value={String(e.id)}>
            {e.nombre}
          </option>
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
          <option key={p.id} value={String(p.id)}>
            {p.nombre}
          </option>
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