import React, { Fragment, useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Spinner from "../layout/Spinner";
import { CRMContext } from "../../context/CRMContext";

const EditarProducto = () => {
  let navigate = useNavigate();
  // obtener el ID
  let params = useParams();
  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
    imagen: "",
  });
  // archivo =  state, guardarArchivo = setState
  const [archivo, guardarArchivo] = useState("");
  const [auth, guardarAuth] = useContext(CRMContext);

  // consultar la api para traer el producto
  const consultarAPI = async () => {
    const productoConsulta = await clienteAxios.get(`/productos/${params.id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    guardarProducto(productoConsulta.data);
  };

  useEffect(() => {
    if (!auth.auth) {
      return navigate("/iniciar-sesion");
    }
    consultarAPI();
    // eslint-disable-next-line
  }, [auth]);

  // Edita un producto
  const editarProducto = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo);
    console.log(formData);
    // almacenarlo en la BD

    try {
      const res = await clienteAxios.put(`/productos/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(res);
      // lanzar alerta
      if (res.status === 200) {
        Swal.fire("Editado correctamente", res.data.mensaje, "success");
      }
      return navigate("/productos");
    } catch (e) {
      console.log(e);
      Swal.fire(
        {
          title: "Hubo un error",
          text: "vuelva a intentarlo",
        },
        "error"
      );
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

  // extraer los valores dle state
  const { nombre, precio, imagen } = producto;

  if (!nombre) return <Spinner />;
  return (
    <Fragment>
      <h2>Editar Producto</h2>

      <form onSubmit={editarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
            value={nombre}
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
            value={precio}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {imagen ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`}
              alt="imagen"
              width={"300"}
            />
          ) : null}
          <input type="file" name="imagen" onChange={leerArchivo} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Editar Producto"
          />
        </div>
      </form>
    </Fragment>
  );
};

export default EditarProducto;
