import React from 'react'

function DropdownMenuItem({linkTo, image}) {
  return (
    <li>
          <Link to='./Sw3AdmTablas'>
          <>
            <div className="image-container">
              <img src={logoTablas} alt="Logo de aplicación" />
            </div>
            <label>
              Tablas
            </label>
          </>
          </Link>
        </li>
  )
}

export default DropdownMenuItem