import React from 'react'
import './PageLogin.css'
import LoginForm from '../../components/loginForm/LoginForm'
import loginBackground from './loginBackground.jpg'
function PageLogin() {
  return (
    <>  
    <div className='page-login'>
      <div className='image-container'>
          <img src={loginBackground} alt='login background' />
      </div>
      <div className='container'>
        <LoginForm></LoginForm>
      </div>
    </div>
        
    </>
  )
}

export default PageLogin