import { useState, useEffect } from 'react';
import './index.css';

// Usa la URL del backend desde VITE_API_URL (Vercel/Render) o localhost en local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const formatearFecha = (fecha) => (fecha ? String(fecha).split('T')[0] : '');

const FORM_VACIO = {
  estudiante_id: '',
  producto_id: '',
  cantidad: '',
  fecha: '',
};

function App() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null); // null = modo "registrar"

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

  // ---------- REGISTRAR o ACTUALIZAR (mismo formulario) ----------
  const guardarVenta = async (e) => {
    e.preventDefault();

    const esEdicion = editandoId !== null;
    const url = esEdicion
      ? `${API_URL}/ventas/${editandoId}`
      : `${API_URL}/ventas`;

    try {
      const res = await fetch(url, {
        method: esEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cantidad: Number(form.cantidad) }),
      });
      if (!res.ok) throw new Error('No se pudo guardar la venta');

      cancelarEdicion();
      cargarTodo();
    } catch (err) {
      console.error(err);
      alert('No se pudo guardar la venta. Revisa la consola.');
    }
  };

  // ---------- EDITAR: carga la venta en el formulario ----------
  const iniciarEdicion = (venta) => {
    // Usa los ids si el backend los envía; si no, los busca por nombre
    const estudianteId =
      venta.estudiante_id ??
      estudiantes.find((e) => e.nombre === venta.estudiante)?.id ??
      '';
    const productoId =
      venta.producto_id ??
      productos.find((p) => p.nombre === venta.producto)?.id ??
      '';

    setEditandoId(venta.id);
    setForm({
      estudiante_id: estudianteId,
      producto_id: productoId,
      cantidad: venta.cantidad,
      fecha: formatearFecha(venta.fecha),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
  };

  // ---------- ELIMINAR ----------
  const eliminarVenta = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta venta?')) return;

    try {
      const res = await fetch(`${API_URL}/ventas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar la venta');

      if (editandoId === id) cancelarEdicion(); // si la estabas editando
      cargarTodo();
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la venta. Revisa la consola.');
    }
  };

  return (
    <div className="main-container">
      <header className="header-title">
        <h1>Cafetería <span>Escolar</span></h1>
      </header>

      <div className="content-grid">
        {/* FORMULARIO (registrar / editar) */}
        <form
          className={`card-form ${editandoId !== null ? 'is-editing' : ''}`}
          onSubmit={guardarVenta}
        >
          <h2 className="card-title">
            {editandoId !== null ? 'Editar Venta' : 'Registrar Nueva Venta'}
          </h2>

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

          <button type="submit" className="btn-submit">
            {editandoId !== null ? 'Actualizar Venta' : 'Registrar Venta'}
          </button>

          {editandoId !== null && (
            <button type="button" className="btn-cancel" onClick={cancelarEdicion}>
              Cancelar edición
            </button>
          )}
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v) => (
                    <tr
                      key={v.id}
                      className={editandoId === v.id ? 'row-editing' : ''}
                    >
                      <td>{v.estudiante}</td>
                      <td>{v.producto}</td>
                      <td>{v.cantidad}</td>
                      <td>${v.precio}</td>
                      <td>${v.total}</td>
                      <td>{formatearFecha(v.fecha)}</td>
                      <td>
                        <button type="button" onClick={() => iniciarEdicion(v)}>
                          Editar
                        </button>
                        <button type="button" onClick={() => eliminarVenta(v.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ventas.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty-row">
                        Aún no hay ventas registradas.
                      </td>
                    </tr>
                  )}
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