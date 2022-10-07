import React, { Fragment, useEffect, useState, useContext } from "react";
import clienteAxios from "../../config/axios";
import DetallesPedido from "./DetallesPedido";

// import el context
import { CRMContext } from "../../context/CRMContext";
import { useNavigate } from "react-router-dom";

const Pedidos = () => {
  let navigate = useNavigate();
  const [pedidos, guardarPedidos] = useState([]);
  const [auth, guardarAuth] = useContext(CRMContext);

  useEffect(() => {
    if (auth.token !== "") {
      const consultarAPI = async () => {
        try {
          const resutlado = await clienteAxios.get("/pedidos", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          guardarPedidos(resutlado.data);
        } catch (e) {
          if ((e.response.status = 500)) {
            return navigate("/iniciar-sesion");
          }
        }
      };
      // si se declara y usa conslultarAPi aqui eso daria error porque es una mala
      // practica.
      consultarAPI();
    } else {
      return navigate("/iniciar-sesion");
    }
    // eslint-disable-next-line
  }, [pedidos, auth]);
  if (!auth.auth) {
    return navigate("/iniciar-sesion");
    // eslint-disable-next-line
  }
  return (
    <Fragment>
      <h2>Pedidos</h2>

      <ul className="listado-pedidos">
        {pedidos.map((pedido) => (
          <DetallesPedido key={pedido._id} pedido={pedido} />
        ))}
      </ul>
    </Fragment>
  );
};

export default Pedidos;
