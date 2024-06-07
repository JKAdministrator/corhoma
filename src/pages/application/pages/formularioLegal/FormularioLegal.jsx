import React from 'react'
import { Routes, Route } from "react-router-dom";
import FormularioLegalBusqueda from './pages/FormularioLegalBusqueda/FormularioLegalBusqueda';
import FormularioLegalFormulario from './pages/FormularioLegalFormulario/FormularioLegalFormulario';
function FormularioLegal() {
  const BUSQUEDA = ()=> {return <FormularioLegalBusqueda />}
  const FORMULARIO = ()=> {return <FormularioLegalFormulario />}
  return (
    <Routes>
      <Route path='busqueda' element={<BUSQUEDA />} />
      <Route path=':idFormularioLegal' element={<FORMULARIO />} />
    </Routes>
  
  )
}

export default FormularioLegal