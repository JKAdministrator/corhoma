import React from 'react'
import { Routes, Route } from 'react-router-dom'
import FormularioLegal from './pages/formularioLegal/FormularioLegal'
import Tablas from './pages/tablas/Tablas'
import AppHeader from '../../components/appHeader/AppHeader.jsx'


const FORMULARIO_LEGAL = ()=> {return <FormularioLegal />}
const TABLAS = ()=> {return <Tablas />}

function Application() {
  return (
    <>
      <AppHeader></AppHeader>
      <Routes>
        <Route path='formularioLegal/*' element={<FORMULARIO_LEGAL />} />
        <Route path='tablas' element={<TABLAS />} />
      </Routes>
    </>
  )
}

export default Application