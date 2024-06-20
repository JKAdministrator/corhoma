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

const loginToApp = async (appCode, username, password)=>{
  console.log({appCode, username, password})
  try{

    const abortController = new AbortController();
    //const url = 'https://172.16.0.5:10180/Sw3WebApps_v.3.7.5_DESA_BSJ/Sw3Commons/Sw3Commons_Lgn.php';
    const url = 'https://172.16.0.5:10180/Sw3WebApps_v.3.7.5_DESA_BSJ/Sw3Commons/Sw3Commons_Lgn_v2.php';
    const body = JSON.stringify({
      userName:         username,
      userPassword:     password,
      userApplication:  appCode,
      app:              appCode,
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
    if(responseJson?.COD?.toString() != '200') throw new Error(`[rsp_cod:${responseJson.DAT[0].rsp_cod}] :: rsp_dat:${responseJson.DAT[0].rsp_dat}`)

    const SUPCValues = Object.values(responseJson.SUPC)
    const SUPC =  Object.keys(responseJson.SUPC).map((key, index)=>{
      return {appCode:key, hasAccess:SUPCValues[index]}
    })

    return {
      SUPC: SUPC, 
      SUPC2: responseJson.SUPC,
      SUID: responseJson.SUID,
      SEID: responseJson.SEID,
      SSTC: responseJson.SSTC,
      STOC: responseJson.STOC
    };
  } catch(e){
    throw `[LoginForm] :: [loginToApp()] :: ${e.toString()}`;  
  }
  return null;
}


function LoginForm() {
  const navigate = useNavigate();
  const {setUser, addError} = useAppContext();

  const [loading, setLoading] = useState(true);
  const [tryingLogin, setTryingLogin] = useState(false);
  const [username, setUsername] = useState('USRADMIN')
  const [password, setPassword] = useState('FIRM01..')
  const [application, setApplication] = useState('')
  const [applications, setApplications] = useState([])

  useEffect(()=>{
    loadConfigJson().then((e)=>{
      setApplications(e.apps);
      setApplication(e.apps[0].code);
      setLoading(false);
    })
  },[])

  const handleLoginClick= async (e)=>{
    setTryingLogin(true);
    try {
      const loginResponse = await loginToApp(application,username, password);
      console.log('loginResponse',{loginResponse})
      setUser({loginResponse, currentApp:application});
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
        <label htmlFor="iApplications">Application:</label>
        <select name="applications" id="iApplications" disabled={tryingLogin? true : false} onChange={(e)=>setApplication(e.target.value)}>
          {
            applications.map(app=>{
              return <option key={app.code} value={app.code}>{app.name}</option>
            })
          }
        </select>
        <button type='button' onClick={handleLoginClick} className={tryingLogin? 'animated-background' : ''} >LOGIN</button>
        </>
      }



    </form>
  )
}

export default LoginForm