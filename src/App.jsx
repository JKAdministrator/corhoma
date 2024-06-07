import './App.css'
import PageLogin from './pages/login/PageLogin.jsx'
import {Route, Routes} from 'react-router-dom'
import Application from './pages/application/Application.jsx'
import 'font-awesome/css/font-awesome.min.css';

const LOGIN = () => <PageLogin/>
const APPLICATION = () => <Application/>

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<LOGIN />} />
      <Route path='/login' element={<LOGIN />} />
      <Route path='/app/*' element={<APPLICATION />} />
    </Routes>
    </>
  )
}

export default App
