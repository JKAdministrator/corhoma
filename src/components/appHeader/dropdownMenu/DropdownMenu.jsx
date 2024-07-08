import React from "react";
import './DropdownMenu.css'
import logoFormularioLegal from '../../../assets/appIcons/formularioLegal.jpg'
import logoTablas from '../../../assets/appIcons/tablas.jpg'
import { Link } from "react-router-dom";
import { useAppContext } from "../../../AppContext";
import DropdownMenuItem from './dropdownMenuItem/DropdownMenuItem.jsx';
const DropdownMenu = () => {
  
  const {logout} = useAppContext();
  const onLogoutHandle = (e)=>{
    logout();
  }
  return (
    <div className="app-header-dropdown-menu">
      <ul>
        <DropdownMenuItem linkTo='./Sw3AdmLegales/busqueda' image={logoFormularioLegal}/>
        <li className="divider"></li>
        <DropdownMenuItem linkTo='./Sw3AdmTablas' image={logoTablas}/>
        <li className="divider"></li>
        <DropdownMenuItem linkTo='./Sw3AdmJson' image={logoFormularioLegal}/>
        <li className="divider"></li>
        <li>
          <Link onClick={onLogoutHandle}>
            <label>Logout</label>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;