import React, { Fragment, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Producto from "./Producto";
import Spinner from "../layout/Spinner";
import { CRMContext } from "../../context/CRMContext";

const Productos = () => {
  let navigation = useNavigate();
  // productos = state, guardarproductos = funcion para guardare el state
  const [productos, guardarproductos] = useState([]);
  const [auth, guardarAuth] = useContext(CRMContext);

  // useEffectr para consultar api cuando cargue
  useEffect(() => {
    if (auth.token !== "") {
      const consultarAPI = async () => {
        try {
          const productosConsulta = await clienteAxios.get("/productos", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });

          guardarproductos(productosConsulta.data);
        } catch (e) {
          if ((e.response.status = 500)) {
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
    // Qyert  a la APi
    const consultarAPI = async () => {};

    consultarAPI();
    // eslint-disable-next-line
  }, [productos]);
  if (!auth.auth) {
    return navigation("/iniciar-sesion");
    // eslint-disable-next-line
  }
  // Spinner de carga

  if (!productos.length) return <Spinner />;
  return (
    <Fragment>
      <h2>Prodcutos</h2>
      <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Producto
      </Link>

      <ul className="listado-productos">
        {productos.map((producto) => (
          <Producto key={producto._id} producto={producto} />
        ))}
      </ul>
    </Fragment>
  );
};

export default Productos;
