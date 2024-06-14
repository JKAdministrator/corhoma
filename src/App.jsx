import './App.css'
import PageLogin from './pages/login/PageLogin.jsx'
import {Route, Routes} from 'react-router-dom'
import Application from './pages/application/Application.jsx'
import 'font-awesome/css/font-awesome.min.css';
import { createContext, useContext } from 'react';

const LOGIN = () => <PageLogin/>
const APPLICATION = () => <Application/>

const UserContext = createContext(null);

function App() {
  
  return (
     <UserContext.Provider value={{}}>
      <Routes>
        <Route path='/' element={<LOGIN />} />
        <Route path='/login' element={<LOGIN />} />
        <Route path='/app/*' element={<APPLICATION />} />
      </Routes>
    </UserContext.Provider>
  )
}

export default App
