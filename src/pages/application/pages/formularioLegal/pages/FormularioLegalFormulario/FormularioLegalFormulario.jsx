import React from 'react'
import { useParams } from 'react-router-dom'
function FormularioLegalFormulario() {
  const {idFormularioLegal} = useParams()
  return (
    <div>FormularioLegalFormulario {idFormularioLegal}</div>
  )
}

export default FormularioLegalFormulario