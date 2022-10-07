import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

// Context

const Login = () => {
  let navigate = useNavigate();
  const [auth, guardarAuth] = useContext(CRMContext);
  // State con los datos del formulario
  const [credenciales, guardarCredenciales] = useState({});

  // iniciar sesión en el servidor
  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await clienteAxios.post(
        "/iniciar-sesion",
        credenciales
      );
      // extraer el token y colocarlo en localstorage
      const { token } = respuesta.data;
      localStorage.setItem("token", token);

      // colocarlo en el state global
      guardarAuth({
        token,
        auth: true,
      });

      // alerta
      Swal.fire("Login Correcto", "Has iniciado Sesión", "success");

      return navigate("/");
    } catch (e) {
      if (e.response) {
        Swal.fire({
          type: "error",
          title: "Hubo un error",
          text: e.response.data.mensaje,
        });
      } else {
        Swal.fire({
          type: "error",
          title: "Hubo un error",
          text: "Hubo un error",
        });
      }
    }
  };
  const leerDatos = (e) => {
    guardarCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email para iniciar Sesión"
              required
              onChange={leerDatos}
              autoComplete="username"
            />
          </div>
          <div className="campo">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password para iniciar Sesión"
              required
              onChange={leerDatos}
              autoComplete="current-password"
            />
          </div>
          <input
            type="submit"
            value="Iniciar Sesión"
            className="btn btn-verde btn-block"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
