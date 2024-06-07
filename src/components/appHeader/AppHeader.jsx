import React, { useState } from 'react'
import './AppHeader.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import DropdownMenu from "./dropdownMenu/DropdownMenu.jsx";

function AppHeader() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isHeaderVisible, setHeaderVisible] = useState(false);

  const handleMouseEnterDropdown = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeaveDropdown = () => {
    setDropdownVisible(false);
  };

  const handleMouseEnterHeader = () => {
    setHeaderVisible(true);
  };

  const handleMouseLeaveHeader = () => {
    setHeaderVisible(false);
  };

  return (
    <header 
      className='application-header'
      onMouseEnter={handleMouseEnterHeader}
      onMouseLeave={handleMouseLeaveHeader}
    >
    {
      isHeaderVisible && 
      <nav>
        <ul>
            <li id='appTitle'>
                <h1>Signafile</h1>
            </li>
            <li id='buttonChangeApp'
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button>
              <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
              {isDropdownVisible && <DropdownMenu />}
            </li>
        </ul>
      </nav>
    }
    </header>
  )
}

export default AppHeader