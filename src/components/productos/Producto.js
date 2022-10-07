import React, { useContext } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
// import el context
import { CRMContext } from "../../context/CRMContext";

const Producto = ({ producto }) => {
  const { _id, nombre, precio, imagen } = producto;
  const [auth, guardarAuth] = useContext(CRMContext);

  const eliminarProducto = (id) => {
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
          .delete(`/productos/${id}`, {
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
    <li className="producto">
      <div className="info-producto">
        <p className="nombre">{nombre}</p>
        <p className="precio">${precio}</p>
        {imagen ? (
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`}
            alt="texto alternativo"
          />
        ) : null}
      </div>
      <div className="acciones">
        <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Producto
        </Link>

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarProducto(_id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Producto
        </button>
      </div>
    </li>
  );
};

export default Producto;
