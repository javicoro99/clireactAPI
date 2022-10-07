import React, { useContext } from "react";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

const DetallesPedido = ({ pedido }) => {
  const { cliente, _id } = pedido;
  const [auth, guardarAuth] = useContext(CRMContext);

  const eliminarPedido = (id) => {
    clienteAxios.delete(`/pedidos/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
  };

  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: {pedido._id}</p>
        <p className="nombre">
          Cliente: {cliente.nombre} {cliente.apellido}
        </p>

        <div className="articulos-pedido">
          <p className="productos">Artículos Pedido: </p>
          <ul>
            {pedido.pedido.map((articulos) => (
              <li key={pedido._id + articulos.producto._id}>
                <p>{articulos.producto.nombre}</p>
                <p>Precio: ${articulos.producto.precio}</p>
                <p>Cantidad: {articulos.cantidad}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="total">Total: {pedido.total}</p>
      </div>
      <div className="acciones">
        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarPedido(_id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Pedido
        </button>
      </div>
    </li>
  );
};

export default DetallesPedido;
