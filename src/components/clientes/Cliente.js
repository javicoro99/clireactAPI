import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

// import el context
import { CRMContext } from "../../context/CRMContext";

const Cliente = ({ cliente }) => {
  const { _id, nombre, apellido, empresa, email, telefono } = cliente;
  const [auth, guardarAuth] = useContext(CRMContext);

  const eliminarCliente = (id) => {
    Swal.fire({
      title: "estas seguro?",
      text: "No se podra revertir este cambio.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borralo.",
      cancelButtonText: "Espera aún no.",
    }).then((result) => {
      if (result.isConfirmed) {
        clienteAxios
          .delete(`/clientes/${id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          })
          .then((res) => {
            Swal.fire("Borrado", res.data.mensaje, "success");
          });
      }
    });
  };
  return (
    <li className="cliente">
      <div className="info-cliente">
        <p className="nombre">
          {nombre} {apellido}
        </p>
        <p className="empresa">{empresa}</p>
        <p>{email}</p>
        <p>{telefono}</p>
      </div>
      <div className="acciones">
        <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Cliente
        </Link>
        <Link to={`/pedidos/nuevo/${_id}`} className="btn btn-amarillo">
          <i className="fas fa-plus"></i>
          Nuevo pedido
        </Link>
        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarCliente(_id)}
        >
          {/* Arriba llama a la funcion onclick al colocar solo la funcion eliminarcliente y poner 
            eliminarcliente(_id) esta se llamara inmediatamente esto se soluciona haciendo un arrow function
            esto evitara que se llame inmediatamente, colocando solo eliminarcliente este esperara al eventro
            pero al colocar el () este se llama de inmediato
          */}
          <i className="fas fa-times"></i>
          Eliminar Cliente
        </button>
      </div>
    </li>
  );
};

export default Cliente;
