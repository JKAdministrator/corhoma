import React, { lazy,  Suspense} from 'react'
import { Routes, Route } from 'react-router-dom'
import AppHeader from '../../components/appHeader/AppHeader.jsx'
import PageLoading from '../../components/pageLoading/PageLoading.jsx'


const TABLAS = lazy(() => import(/* webpackChunkName: "CardSection" */ './pages/tablas/Tablas.jsx'));
const FORMULARIO_LEGAL = lazy(() => import(/* webpackChunkName: "CardSection" */ './pages/formularioLegal/FormularioLegal.jsx'));


function Application() {
  return (
    <>
      <AppHeader></AppHeader>
      <Routes>
        <Route path='Sw3AdmLegales/*' element={
            <Suspense fallback={<PageLoading />}>
              <FORMULARIO_LEGAL />
            </Suspense>
          } />
        <Route path='Sw3AdmTablas' element={
          <Suspense fallback={<PageLoading />}>
            <TABLAS />
          </Suspense>
        } />
      </Routes>
    </>
  )
}

export default Application