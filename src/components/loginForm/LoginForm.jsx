import React, { useContext, useEffect, useState } from 'react'
import './LoginForm.css'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppContext';

const loadConfigJson = async ()=>{
  const response = await fetch('/config/webServicesConfig.json',{headers:{
    accept: 'application/json'
  }});
  return await response.json();
}

const loginToApp = async (username, password)=>{
  try{

    const abortController = new AbortController();
    const url = 'https://172.16.0.29:6051/Sw3WebApps_v.3.7.5_DESA_REACT/Sw3Commons/Sw3_login.php';
    const body = JSON.stringify({
      username:     username,
      password:     password
    })
    const method = 'POST'
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    }
    const initData = {
      method: method,
      body: body,
      headers: headers,
      signal: abortController?.signal
    }
    const response = await fetch(url,initData);
    const responseJson = await response.json(); 
    if(!responseJson ) throw new Error('No responseJson found')
    if(responseJson.cod != '200') throw new Error(`[${responseJson.cod}] :: ${responseJson.err}`)
    return responseJson.dat;
  } catch(e){
    throw `[LoginForm] :: [loginToApp()] :: ${e.toString()}`;  
  }
}


function LoginForm() {
  const {setUser, addError} = useAppContext();
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
      console.log('loginResponse',{loginResponse})
      setUser({loginResponse, currentApp:'lication'});
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