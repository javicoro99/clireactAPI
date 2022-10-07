import React, { Fragment, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

const NuevoCliente = () => {
  let navigate = useNavigate();

  //cliente = state, setCliente = funcicon para guardar el state
  const [cliente, setCiente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });
  const [auth, guardarAuth] = useContext(CRMContext);
  // leer los datos del formulario
  const actualizarState = (e) => {
    // Almacenar lo que el usuario escribe en el state
    setCiente({
      ...cliente, // se toma una copia para que permanezca los valores escritos
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (!auth.auth) {
      return navigate("/iniciar-sesion");
    }
  }, [auth]);
  // Añade en la rest API un cliente nuevo
  const agregarCliente = (e) => {
    e.preventDefault();

    // enviar petición
    clienteAxios
      .post("/clientes", cliente, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      // el orden es importante para la petición
      // primero es el url o end point
      // luego los datos
      // y luego las configuraciónes o headers
      .then((res) => {
        if (res.data.code === 11000) {
          Swal.fire({
            type: "error",
            title: "Hubo un error",
            text: "Ese cliente ya esta registrado",
          });
        } else {
          console.log(res.data);
          Swal.fire("Se agregó el Cliente", res.data.mensaje, "success");
        }

        // Redireccionar
        return navigate("/");
      });
  };

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
      <h2>Nuevo Cliente</h2>
      <form onSubmit={agregarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Cliente"
            disabled={validarCliente()} // al añadir los () esto le dice que se ejecute de inmediato
            // si solo se pone el nombre react esperara algun evento que lo active
          />
        </div>
      </form>
    </Fragment>
  );
};

// HOC, es una función que toma un componente y retorna un nuevo componente
export default NuevoCliente;
