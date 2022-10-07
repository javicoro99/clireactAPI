import React, { Fragment, useState, useEffect, useContext } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { CRMContext } from "../../context/CRMContext";

const EditarCliente = () => {
  let navigate = useNavigate();
  // obtener el ID
  let params = useParams();
  //cliente = state, setCliente = funcicon para guardar el state
  const [cliente, datosCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });
  const [auth, guardarAuth] = useContext(CRMContext);

  // Query a la API
  const consultarAPI = async () => {
    const clienteConsulta = await clienteAxios.get(`/clientes/${params.id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    datosCliente(clienteConsulta.data);
  };

  // useEffect, cuando el compoennte carga
  useEffect(() => {
    if (!auth.auth) {
      return navigate("/iniciar-sesion");
    }
    consultarAPI();
    // eslint-disable-next-line
  }, [auth]);

  // leer los datos del formulario
  const actualizarState = (e) => {
    // Almacenar lo que el usuario escribe en el state
    datosCliente({
      ...cliente, // se toma una copia para que permanezca los valores escritos
      [e.target.name]: e.target.value,
    });
    console.log(cliente);
  };

  // Envia una petición por axios para actualizar el cliente
  const actualizarCliente = (e) => {
    e.preventDefault();

    // enviar petición por axios
    clienteAxios
      .put(`/clientes/${cliente._id}`, cliente, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        if (res.data.code === 11000) {
          Swal.fire({
            type: "error",
            title: "Hubo un error",
            text: "Ese cliente ya esta registrado",
          });
        } else {
          console.log(res.data);
          Swal.fire("Correcto", "Se actualizó correctamente", "success");
        }
        // Redireccionar
        return navigate("/");
      });
  };

  // Editar cliente

  // Validar el formulario
  const validarCliente = () => {
    //destructuring
    const { nombre, apellido, empresa, email, telefono } = cliente;

    // revisar que la propiedades del state tengan contenido
    let valido =
      !nombre.length ||
      !apellido.length ||
      !empresa.length ||
      !email.length ||
      !telefono.length;
    // return true o false
    return valido;
  };
  return (
    <Fragment>
      <h2>Editar Cliente</h2>
      <form onSubmit={actualizarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
            value={cliente.nombre}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
            value={cliente.apellido}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
            value={cliente.empresa}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
            value={cliente.email}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
            value={cliente.telefono}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Cambios"
            disabled={validarCliente()} // al añadir los () esto le dice que se ejecute de inmediato
            // si solo se pone el nombre react esperara algun evento que lo active
          />
        </div>
      </form>
    </Fragment>
  );
};

// HOC, es una función que toma un componente y retorna un nuevo componente
export default EditarCliente;
