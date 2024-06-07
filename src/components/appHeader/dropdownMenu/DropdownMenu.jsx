import React from "react";
import './DropdownMenu.css'
import logoFormularioLegal from '../../../assets/appIcons/formularioLegal.jpg'
import logoTablas from '../../../assets/appIcons/tablas.jpg'
import { Link } from "react-router-dom";
const DropdownMenu = () => {
  return (
    <div className="app-header-dropdown-menu">
      <ul>
        <li>
          <Link to='./formularioLegal/busqueda'>
            <div className="image-container">
              <img src={logoFormularioLegal} alt="Logo de aplicación" />
            </div>
            <label>
              Formulario Legal
            </label>
          </Link>
        </li>
        <li className="divider"></li>
        <li>
          <Link to='./tablas'>
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
      </ul>
    </div>
  );
};

export default DropdownMenu;