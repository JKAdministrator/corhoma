import React, {useContext }from 'react'
import 'font-awesome/css/font-awesome.min.css';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './AppErrorList.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import { useAppContext } from '../../AppContext.jsx';

function AppErrorList() {
  const {removeError, errors} = useAppContext();
  const onRemoveClick = (e)=>{
    removeError(e.currentTarget.dataset.code)
  }

  return (
    <ul className='app-error-list'>
        {
           Array.from(errors).reverse().map(error=>{
                return <li key={error.code} data-key={`${error.code}`} className='animation-fade-in-1000'>
                <button type='button' onClick={onRemoveClick} data-code={`${error.code}`}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
                <span >{error.errorMessage}</span>
            </li> 
            })
        }
        
    </ul>
  )
}

export default AppErrorList