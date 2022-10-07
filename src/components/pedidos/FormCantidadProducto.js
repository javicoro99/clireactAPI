import React from "react";

const FormCantidadProducto = (props) => {
  const { nombre, precio, cantidad } = props.producto;
  const { restarProductos, aumentarProductos, eliminarProductoPedido, index } =
    props;
  return (
    <li>
      <div className="texto-producto">
        <p className="nombre">{nombre}</p>
        <p className="precio">$ {precio}</p>
      </div>
      <div className="acciones">
        <div className="contenedor-cantidad">
          <i
            className="fas fa-minus"
            onClick={() => restarProductos(index)}
          ></i>
          <p>{cantidad}</p>
          <i
            className="fas fa-plus"
            onClick={() => aumentarProductos(index)}
          ></i>
        </div>
        <button
          type="button"
          className="btn btn-rojo"
          onClick={() => eliminarProductoPedido(props.producto.producto)}
        >
          <i className="fas fa-minus-circle"></i>
          Eliminar Producto
        </button>
      </div>
    </li>
  );
};

export default FormCantidadProducto;
