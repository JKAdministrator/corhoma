import React, { useEffect, useState } from 'react'
import './LoginForm.css'
import { useNavigate } from 'react-router-dom';

const loadConfigJson = async ()=>{
  const response = await fetch('/config/webServicesConfig.json',{headers:{
    accept: 'application/json'
  }});
  return await response.json();
}

const loginToApp = async (appCode, username, password)=>{

  /*response = await fetch(fetchUrl, {
    method: webServicesData.method,
    body: webServicesData.stringifyBody
      ? JSON.stringify(postData)
      : postData,
    headers: webServicesData.headers,
    signal: signal
  });*/

  //response = await fetch('', {

  const response = await fetch('/config/webServicesConfig.json',{headers:{
    accept: 'application/json'
  }});
  return await response.json();
}


function LoginForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tryingLogin, setTryingLogin] = useState(false);
  const [username, setUsername] = useState('USRADMIN')
  const [password, setPassword] = useState('FIRM01..')
  const [applications, setApplications] = useState([])
  
  useEffect(()=>{
    loadConfigJson().then((e)=>{
      setApplications(e.apps);
      setLoading(false);
    })
  },[])


  

  const handleLoginClick=(e)=>{

    setTryingLogin(true);
    //navigate('/app/formularioLegal/busqueda')

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
        <input type="text" name="username" id="iUsername" autoFocus autoComplete='username' defaultValue={username} disabled={tryingLogin? true : false}/>
        <label htmlFor="iPassword">Password:</label>
        <input type="password" name="password" id="iPassword" defaultValue={password} autoComplete='current-password' disabled={tryingLogin? true : false}/>
        <label htmlFor="iApplications">Application:</label>
        <select name="applications" id="iApplications" disabled={tryingLogin? true : false}>
          {
            applications.map(app=>{
              return <option key={app.code} value={app.code}>{app.name}</option>
            })
          }
        </select>
        <button type='button' onClick={handleLoginClick} className={tryingLogin? 'animated-background' : ''}>LOGIN</button>
        </>
      }



    </form>
  )
}

export default LoginForm