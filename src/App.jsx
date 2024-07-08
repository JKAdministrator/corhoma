import './App.css'
import PageLogin from './pages/login/PageLogin.jsx'
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';
import AppErrorList from './components/appErrorList/AppErrorList.jsx';
import React, { lazy,  Suspense, useEffect, useState } from 'react';
import { useAppContext } from './AppContext.jsx'; 
import PageLoading from './components/pageLoading/PageLoading.jsx';
import PageNotFound from './pages/noFound/PageNotFound.jsx';
import ProtectedRoute from '../ProtectedRoute.jsx';
import AppPrivateContextProvider from './apiContexts/ApiPrivateContext.jsx';
import AppPublicContextProvider from './apiContexts/ApiPublicContext.jsx';

const LOGIN = lazy(() => import('./pages/login/PageLogin.jsx'));
const APPLICATION = lazy(() => import('./pages/application/Application.jsx'));

console.log('VARIABLES DE AMBIENTE (ENV)',{VITE_APP_PATH:import.meta.env.VITE_APP_PATH});

function App() {

  const {user, loading} = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiDataReady, setApiDataReady] = useState(false);

  useEffect(()=>{
    if(user){
      navigate(`/app/Sw3AdmTablas`);
    } 
  },[user]);

  useEffect(()=>{
    console.log('loading change now is',loading)
    setApiDataReady(!loading);
  },[loading])

  if(!apiDataReady) return  <label htmlFor="">loading</label>
  return ( 
      <>
      <AppPublicContextProvider>
        <Routes>
        <Route path='/*' element={
          <Suspense fallback={<PageLoading />}>
              <LOGIN />
          </Suspense>
        } />
        <Route path='/login' element={
          <Suspense fallback={<PageLoading />}>
            <LOGIN />
          </Suspense>
        } />
      <Route path='/app/*' element={
          <Suspense fallback={<PageLoading />}>
            <ProtectedRoute>
            <AppPrivateContextProvider>
              <APPLICATION />
            </AppPrivateContextProvider>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      </AppPublicContextProvider>
      <AppErrorList />
     </>
    )
}

export default App
