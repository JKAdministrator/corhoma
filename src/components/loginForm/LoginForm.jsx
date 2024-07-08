import React, { useContext, useEffect, useState } from 'react'
import './LoginForm.css';
import { useApiPublicContext } from '../../apiContexts/ApiPublicContext.jsx';
import { useAppContext } from '../../AppContext.jsx';
import axios from 'axios';

function LoginForm() {
  const { loading, API_AUTH, API_TEST }                     = useApiPublicContext();
  const [ loadingComponent, setLoadingComponent]  = useState(true);

  const {addError, login}             = useAppContext();
  const [tryingLogin, setTryingLogin] = useState(false);
  const [username, setUsername]       = useState('USRADMIN');
  const [password, setPassword]       = useState('FIRM01..');

  const handleLoginClick= async (e)=>{
      if(!loadingComponent){
        try {
          setTryingLogin(true);
         //const testResponse = await API_TEST.test_config();
         //console.log('testResponse [on LOGIN FORM (1)]',testResponse);
         //const testResponse2 = await API_TEST.test_config();
         //console.log('testResponse [on LOGIN FORM (2)]',testResponse2);

         const loginResponse = await API_AUTH.login(username, password);
         login(loginResponse.dat.token, loginResponse.dat.refreshToken);
         setTryingLogin(false);
         }catch(e){
          addError(e.toString());
          setTryingLogin(false);
        }    
      }
  }

  useEffect(()=>{
    console.log('LoginForm useEffect() ',{loading, API_AUTH, loadingComponent});
    if(!loading){
      setLoadingComponent(false);
    }
  },[loading]);

  return <form className={`login-form`}>
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
    </form>;
  
}

export default LoginForm