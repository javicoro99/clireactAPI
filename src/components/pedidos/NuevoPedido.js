import React, { useEffect, useState, Fragment, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import FormBuscarProducto from "./FormBuscarProducto";
import FormCantidadProducto from "./FormCantidadProducto";
import { CRMContext } from "../../context/CRMContext";

const NuevoPedido = () => {
  let { id } = useParams();
  let navigate = useNavigate();

  // state
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState("");
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);
  const [auth, guardarAuth] = useContext(CRMContext);

  useEffect(() => {
    if (!auth.auth) {
      return navigate("/iniciar-sesion");
    }
    const consultarAPI = async () => {
      // consultar cliente actual
      const resultado = await clienteAxios.get(`/clientes/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      guardarCliente(resultado.data);
    };
    consultarAPI();

    // actualizar el total
    actualizarTotal();
    // eslint-disable-next-line
  }, [productos, auth]);

  const buscarProducto = async (e) => {
    e.preventDefault();
    // obtener los productos de la busqueda
    try {
      const resultadoBusqueda = await clienteAxios.post(
        `/productos/busqueda/${busqueda}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      // SOLO EN METODOS DONDE SE ENVIEN DATOS
      // JAMAS OLVIDAR QUE AXIOS EN SU INCREIBLE TONTERIA A TIENE QUE TENER
      // SI O SI 3 PARAMETROS 3!!!! Y SI NO VAS A MANDAR UN BODY ENVIA UN NULL
      // SI NO SE HACE ESTO EL SEGUNDO PARAMETRO SIEMPRE SIEMPREEEEEEEEEEEEEEEE
      // SERA TOMADO COMO DATA >:s
      // si no hay resultados una alerta, contrario agregarlo al state

      if (resultadoBusqueda.data[0]) {
        let productoResultado = resultadoBusqueda.data[0];
        // agregar
        productoResultado.producto = resultadoBusqueda.data[0]._id;
        productoResultado.cantidad = 0;

        // Ponerlo en el state
        guardarProductos([...productos, productoResultado]);
      } else {
        // no hay resultados
        Swal.fire({
          type: "error",
          title: "No resultados",
          text: "No hay resultados.",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // almacenar una bvusqyeda en el astate
  const leerDatosBusqueda = (e) => {
    guardarBusqueda(e.target.value);
  };
  // actualizar la cantidad de productos
  const restarProductos = (i) => {
    // copiar arreglo original de productos
    const todosProductos = [...productos];

    // Validar si esta en 0 no puede ir mas alla
    if (todosProductos[i].cantidad === 0) return;
    todosProductos[i].cantidad--;
    guardarProductos(todosProductos);
  };

  const aumentarProductos = (i) => {
    // copiar arreglio para no mutarlo
    const todosProductos = [...productos];

    // incrementos
    todosProductos[i].cantidad++;

    // almacenar en el state
    guardarProductos(todosProductos);
  };

  // Elimina un producto del state
  const eliminarProductoPedido = (id) => {
    const todosProductos = productos.filter(
      (producto) => producto.producto !== id
    );

    guardarProductos(todosProductos);
  };
  // Actualizar el total a pagar
  const actualizarTotal = () => {
    if (productos.length === 0) {
      guardarTotal(0);
      return;
    }

    // calcular nuevo total
    let nuevoTotal = 0;

    // recorrer todos los productos y sus cantidades y precios
    productos.map(
      (producto) => (nuevoTotal += producto.cantidad * producto.precio)
    );

    guardarTotal(nuevoTotal);
  };

  const realizarPedido = async (e) => {
    e.preventDefault();

    // extraer el ID
    const pedido = {
      cliente: id,
      pedido: productos,
      total: total,
    };
    // almacenar en la BD
    const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    // leeer resutaldo
    if (resultado.status === 200) {
      Swal.fire(
        {
          title: "Correcto",
          text: resultado.data.mensaje,
        },
        "succes"
      );
    } else {
      Swal.fire({
        type: "error",
        title: "Hubo un error",
        text: "No hay resultado",
      });
    }
    return navigate("/pedidos");
  };
  const { nombre, apellido, telefono } = cliente;
  return (
    <Fragment>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <p>
          Nombre: {nombre} {apellido}
        </p>
        <p>Teléfono: {telefono}</p>
      </div>

      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        {productos.map((producto, index) => (
          <FormCantidadProducto
            key={producto.producto}
            producto={producto}
            restarProductos={restarProductos}
            aumentarProductos={aumentarProductos}
            eliminarProductoPedido={eliminarProductoPedido}
            index={index}
          />
        ))}
      </ul>
      <p className="total">
        Total a pagar: <span>$ {total}</span>
      </p>
      {total > 0 ? (
        <form onSubmit={realizarPedido}>
          <input
            type="submit"
            className="btn btn-verde btn-block"
            value="Realizar Pedido"
          />
        </form>
      ) : null}
    </Fragment>
  );
};

export default NuevoPedido;
