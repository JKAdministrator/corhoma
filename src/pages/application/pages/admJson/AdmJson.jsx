import React, { useEffect, useState } from 'react'
import AppTable, {TABLE_SORT_ORDER, TABLE_DATA_TYPE, TABLE_PAGE_SIZES} from '../../../../components/appTable/AppTable';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import './Tablas.css'
import { effect, useSignalEffect } from "@preact/signals-react";
import AppMenu, {SIGNAL_SELECTED_APP_MENU_OPTION_CODE} from '../../../../components/appMenu/AppMenu.jsx'
import { useAppContext } from '../../../../AppContext.jsx'
import { useApiPrivateContext  } from '../../../../apiContexts/ApiPrivateContext.jsx'
import { useNavigate, useParams} from 'react-router-dom';

const appMenu = ()=>{
    return [
        { key:'1',      action:'SGFTSB',   label:'json 1' },
        { key:'2',         action:'SGFTCP',   label:'json 2' },
        { key:'3',                  action:'SGFTCS',   label:'json 3' }
        
      ]
  }

function AdmJson() {

    useSignalEffect(()=>{
        console.log(`SIGNAL_SELECTED_APP_MENU_OPTION_CODE changed to ${SIGNAL_SELECTED_APP_MENU_OPTION_CODE.value}`);
        if(SIGNAL_SELECTED_APP_MENU_OPTION_CODE.value) navigate(`/app/Sw3AdmTablas/${SIGNAL_SELECTED_APP_MENU_OPTION_CODE.value}`);
    })
    

    return (
        <>
        <AppMenu treeData={menu}/>
        <div>AdmJson</div>
        </>
    )
}

export default AdmJson