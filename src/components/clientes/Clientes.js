import React, { useEffect, useState, Fragment, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
// importar cliente axios
import clienteAxios from "../../config/axios";
import Cliente from "./Cliente";
import Spinner from "../layout/Spinner";

// import el context
import { CRMContext } from "../../context/CRMContext";

const Clientes = () => {
  let navigation = useNavigate();
  const [clientes, guargarClientes] = useState([]);

  // utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
  // use effect es similar a componentdidmount y willmount
  useEffect(() => {
    if (auth.token !== "") {
      const consultarAPI = async () => {
        try {
          const clientesConsulta = await clienteAxios.get("/clientes", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          guargarClientes(clientesConsulta.data);
        } catch (e) {
          if (e.response.status === 500) {
            return navigation("/iniciar-sesion");
          }
        }
      };
      // si se declara y usa conslultarAPi aqui eso daria error porque es una mala
      // practica.
      consultarAPI();
    } else {
      return navigation("/iniciar-sesion");
    }
    // eslint-disable-next-line
  }, [clientes]); // al poner [] el codigo solo se ejecuta una vez al iniciar
  // en la segunda seccion de useEffect se coloca de que elemento dependera el cambio

  // si el state esta como false
  if (!auth.auth && localStorage.getItem("token" === auth.token)) {
    return navigation("/iniciar-sesion");
    // eslint-disable-next-line
  }
  if (!clientes.length) return <Spinner />;
  return (
    <Fragment>
      <h2>Clientes</h2>
      <Link to="/clientes/nuevo" className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>
      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          <Cliente cliente={cliente} key={cliente._id} />
        ))}
      </ul>
      <Outlet />
    </Fragment>
  );
};

export default Clientes;
