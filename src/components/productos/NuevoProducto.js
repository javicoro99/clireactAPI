import React, { Fragment, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

const NuevoProducto = () => {
  let navigate = useNavigate();
  // producto = state, guardarproducto = setstate
  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
  });
  const [auth, guardarAuth] = useContext(CRMContext);

  // archivo =  state, guardarArchivo = setState

  const [archivo, guardarArchivo] = useState("");

  useEffect(() => {
    if (!auth.auth) {
      return navigate("/iniciar-sesion");
    }
    // eslint-disable-next-line
  }, [auth]);
  // almacena el nuevo producto en la base de datos.
  const agregarProducto = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo);
    // almacenarlo en la BD

    try {
      const res = await clienteAxios.post("/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      // lanzar alerta
      if (res.status === 200) {
        Swal.fire("Agregado correctamente", res.data.mensaje, "success");
      }
      return navigate("/productos");
    } catch (e) {
      console.log(e);
      Swal.fire({
        type: "error",
        title: "Hubo un error",
        text: "vuelva a intentarlo",
      });
    }
  };

  // leer los datos del formulario
  const leerInformacionProducto = (e) => {
    guardarProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };
  // COLOca imagen en el state
  const leerArchivo = (e) => {
    console.log(e.target.files);
    guardarArchivo(e.target.files[0]);
  };
  return (
    <Fragment>
      <h2>Nuevo Producto</h2>

      <form onSubmit={agregarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.00"
            step="1"
            placeholder="Precio"
            onChange={leerInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          <input type="file" name="imagen" onChange={leerArchivo} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Producto"
          />
        </div>
      </form>
    </Fragment>
  );
};

export default NuevoProducto;
