import React, { useContext, useEffect, useState } from 'react'
import './LoginForm.css'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppContext';
import API from '../../api/Api.jsx';

const loadConfigJson = async ()=>{
  const response = await fetch('/config/webServicesConfig.json',{headers:{
    accept: 'application/json'
  }});
  return await response.json();
}

const loginToApp = async (username, password)=>{
  try {
    console.log('calling loginToApp',{username, password});
    const response = await API.auth.login(username, password);
    console.log('calling loginToApp end');
    if(response.cod !== '200') throw new Error(response.err);
    return response.dat;
  } catch(e){
    throw `${e.toString()}`;  
  }
}


function LoginForm() {
  const {addError, login } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [tryingLogin, setTryingLogin] = useState(false);
  const [username, setUsername] = useState('USRADMIN')
  const [password, setPassword] = useState('FIRM01..')

  useEffect(()=>{
    loadConfigJson().then((e)=>{
      setLoading(false);
    })
  },[])

  const handleLoginClick= async (e)=>{
    setTryingLogin(true);
    try {
      const loginResponse = await loginToApp(username, password);
      login(loginResponse.token, loginResponse.refreshToken);
     }catch(e){
      addError(e.toString());
      setTryingLogin(false);
    }
  }
  return (
    <form className={`login-form ${loading ? 'animated-background' : ''}`}>
      {
        loading ? <></> : <>
              <div className='titles-container'>
        <h2>Corhoma S.R.L.</h2>
        <h1>Signafile</h1>
        <h3>Sistema de Administración Legal Corporativo</h3>
      </div>
        <label htmlFor="iUsername">Username:</label>
        <input type="text" name="username" id="iUsername" autoFocus autoComplete='username' defaultValue={username} disabled={tryingLogin? true : false} onChange={(e)=>setUsername(e.target.value)}/>
        <label htmlFor="iPassword">Password:</label>
        <input type="password" name="password" id="iPassword" defaultValue={password} autoComplete='current-password' disabled={tryingLogin? true : false} onChange={(e)=>setPassword(e.target.value)}/>
        <button type='button' onClick={handleLoginClick} className={tryingLogin? 'animated-background' : ''} >LOGIN</button>
        </>
      }
    </form>
  )
}

export default LoginForm