import React, { useState } from "react";

const CRMContext = React.createContext([{}, () => {}]);
// el contexto se crea refiriendose a lo que se usara
const CRMProvider = (props) => {
  // definir el state inicial
  const [auth, guardarAuth] = useState({
    token: "",
    auth: false,
  });
  // arriba iniciamos el contexto asi porque el auth es un {} objeto y el guardarToken es una funcion
  return (
    <CRMContext.Provider value={[auth, guardarAuth]}>
      {props.children}
    </CRMContext.Provider>
  );
};

export { CRMContext, CRMProvider };
