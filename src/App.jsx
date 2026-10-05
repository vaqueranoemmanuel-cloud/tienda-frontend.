import { useState, useEffect } from 'react';
import './index.css';

// Cambia esto por la URL de tu backend en Render cuando lo subas
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const formatearFecha = (fecha) => (fecha ? fecha.split('T')[0] : '');

function App() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);

  const [form, setForm] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: '',
    fecha: '',
  });

  // Cargar datos al abrir la página
  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [resEst, resProd, resVentas] = await Promise.all([
        fetch(`${API_URL}/estudiantes`),
        fetch(`${API_URL}/productos`),
        fetch(`${API_URL}/ventas`),
      ]);
      if (!resEst.ok || !resProd.ok || !resVentas.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      setEstudiantes(await resEst.json());
      setProductos(await resProd.json());
      setVentas(await resVentas.json());
    } catch (err) {
      console.error('No se pudo conectar con el servidor:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrarVenta = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('No se pudo registrar la venta');
      setForm({ estudiante_id: '', producto_id: '', cantidad: '', fecha: '' });
      cargarTodo(); // refresca la tabla
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-container">
      <header className="header-title">
        <h1>Cafetería <span>Escolar</span></h1>
      </header>

      <div className="content-grid">
        {/* FORMULARIO */}
        <form className="card-form" onSubmit={registrarVenta}>
          <h2 className="card-title">Registrar Nueva Venta</h2>

          <select
            className="form-control"
            name="estudiante_id"
            value={form.estudiante_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione estudiante</option>
            {estudiantes.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>

          <select
            className="form-control"
            name="producto_id"
            value={form.producto_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>

          <input
            type="number"
            className="form-control"
            name="cantidad"
            placeholder="Cantidad"
            min="1"
            value={form.cantidad}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            className="form-control"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-submit">Registrar Venta</button>
        </form>

        {/* TABLA + IMAGEN */}
        <section className="right-section">
          <div className="table-and-image-wrapper">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v) => (
                    <tr key={v.id}>
                      <td>{v.estudiante}</td>
                      <td>{v.producto}</td>
                      <td>{v.cantidad}</td>
                      <td>${v.precio}</td>
                      <td>${v.total}</td>
                      <td>{formatearFecha(v.fecha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

export default App;