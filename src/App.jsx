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

const LOGIN = lazy(() => import('./pages/login/PageLogin.jsx'));
const APPLICATION = lazy(() => import('./pages/application/Application.jsx'));

function App() {

  const {user, trySetUserFromCurrentTokens} = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    if(user){
      navigate(`/app/Sw3AdmTablas`);
    } 
  },[user])

  return (
     <>
      <Routes>
        <Route path='/' element={
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
              <APPLICATION />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <AppErrorList />
     </>
  )
}

export default App
