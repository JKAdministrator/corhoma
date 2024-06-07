import React from 'react'
import './LoginForm.css'
import { useNavigate } from 'react-router-dom';
function LoginForm() {
  const navigate = useNavigate();

  const handleLoginClick=(e)=>{
    navigate('/app/formularioLegal/busqueda')
  }
  return (
    <form className='login-form'>
      <div className='titles-container'>
        <h2>Corhoma S.R.L.</h2>
        <h1>Signafile</h1>
        <h3>Sistema de Administración Legal Corporativo</h3>
      </div>
        <label htmlFor="iUsername">Username:</label>
        <input type="text" name="username" id="iUsername" autoFocus autoComplete='username'/>
        <label htmlFor="iPassword">Password:</label>
        <input type="password" name="password" id="iPassword"/>
        <button type='button' onClick={handleLoginClick}>LOGIN</button>
    </form>
  )
}

export default LoginForm