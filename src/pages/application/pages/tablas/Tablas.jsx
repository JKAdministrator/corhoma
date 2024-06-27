import React, { useEffect, useState } from 'react'
import AppTable, {TABLE_SORT_ORDER, TABLE_DATA_TYPE} from '../../../../components/appTable/AppTable';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import './Tablas.css'
import AppMenu, {SIGNAL_SELECTED_APP_MENU_OPTION_CODE} from '../../../../components/appMenu/AppMenu.jsx'
import { useAppContext } from '../../../../AppContext.jsx'
import { effect, useSignalEffect } from "@preact/signals-react";

const appMenu = ()=>{
  return [
      {
        key:'TablasLegacy',
        action:undefined,
        label:'Tablas Legacy',
        childs:[
          { key:'TablasLegacy:SucursalesBancarias',      action:'SGFTSB',   label:'Sucursales Bancarias' },
          { key:'TablasLegacy:TablaDeProductos',         action:'SGFTCP',   label:'Tabla de Productos' },
          { key:'TablasLegacy:Monedas',                  action:'SGFTCS',   label:'Monedas' },
          { key:'TablasLegacy:DocumentoDeIdentidad',     action:'SGFTTD',   label:'Documento de Identidad' },
          { key:'TablasLegacy:FacultadesLegales',        action:'SGFTFA',   label:'Facultades Legales' },
          { key:'TablasLegacy:GruposLegalesDeBastanteo', action:'SGFTGT',   label:'Grupos Legales de Bastanteo' },
          { key:'TablasLegacy:SGFCTL',                   action:'SGFCTL',   label:'SGFCTL' },
          { key:'TablasLegacy:SGFCAF',                   action:'SGFCAF',   label:'SGFCAF' }
        ]
      },
      {
        key:'TablasFLC',
        action:undefined,
        label:'Tablas FLC',
        childs:[
          { key:'TablasFLC:Sucursales',                   action:'SW3NAVTSB',     label:'Sucursales' },
          { key:'TablasFLC:Productos',                    action:'SW3NAVTCP',     label:'Productos' },
          { key:'TablasFLC:Monedas',                      action:'SW3NAVTCS',     label:'Monedas' },
          { key:'TablasFLC:TipoDocumento',                action:'SW3NAVTTD',     label:'Tipo Documento' },
          { key:'TablasFLC:Facultades',                   action:'SW3NAVTFA',     label:'Facultades' },
          { key:'TablasFLC:GrupoProductoFacultad',        action:'SW3NAVGPF',     label:'Grupo Producto Facultad' },
          { key:'TablasFLC:TipoDocumentoLegalBastanteo',  action:'SW3NAVTCD',     label:'Tipo Documento Legal Bastanteo' },
          { key:'TablasFLC:RolJuridico',                  action:'SW3NAVTCR',     label:'Rol Juridico' },
          { key:'TablasFLC:GrupoLegalesBastanteo',        action:'SW3NAVTGT',     label:'Grupo Legales Bastanteo' },
          { key:'TablasFLC:EntidadesJuridicas',           action:'SW3NAVTTE',     label:'Entidades Juridicas' },
          { key:'TablasFLC:RolesJuridicos',               action:'SW3NAVTRL',     label:'Roles Juridicos' },
          { key:'TablasFLC:GruposFacultades',             action:'TABLAFLC',      label:'Grupos Facultades' }
        ]
      },
    ]
}


const tablaDePrueba = ()=>{
  return {
    IS_LOADING:false,
    IS_MULTI_ROW_SELECTABLE: true,
    TITLE: 'Datos del Cliente',
    DEFAULT_SORT_COLUMN_KEY:'FIRSTNAME',
    DEFAULT_SORT_ORDER:TABLE_SORT_ORDER.DESC,
    HEADERS:[
      {key:'ID',          label:'Id',       isKey:true, align:'center', width:'5rem',  isAction:false,  icon:undefined,           sortable:true, dataType:TABLE_DATA_TYPE.NUMBER},
      {key:'FIRSTNAME',   label:'Nombre',   isKey:false, align:'left',   width:'1fr',  isAction:false,  icon:undefined,           sortable:true, dataType:TABLE_DATA_TYPE.STRING},
      {key:'FAMILYNAME',  label:'Apellido', isKey:false, align:'left',   width:'1fr',  isAction:false,  icon:undefined,           sortable:true, dataType:TABLE_DATA_TYPE.STRING},
      {key:'AGE',         label:'Edad',     isKey:false, align:'center', width:'5rem', isAction:false,  icon:undefined,           sortable:true, dataType:TABLE_DATA_TYPE.NUMBER},
      {key:'ACTION_1',    label:'A1',       isKey:false, align:'center', width:'5rem', isAction:true,   icon:faEllipsisVertical,  sortable:true, dataType:TABLE_DATA_TYPE.BOOLEAN},
      {key:'ACTION_2',    label:'A2',       isKey:false, align:'center', width:'5rem', isAction:true,   icon:faEllipsisVertical,  sortable:true, dataType:TABLE_DATA_TYPE.BOOLEAN},
      {key:'ACTION_3',    label:'A3',       isKey:false, align:'center', width:'5rem', isAction:true,   icon:faEllipsisVertical,  sortable:true, dataType:TABLE_DATA_TYPE.BOOLEAN}
    ],
    ROWS:[
      {key:1,   data:['1',  'Julio',        'Kania',  '37', true,   true,   true]},
      {key:2,   data:['2',  'Nicolas',      'Kania',  '30', false,  false,  false]},
      {key:3,   data:['3',  'Florencia',    'Kania',  '20', false,  true,   true]},
      {key:4,   data:['4',  'Luisa',        'Pagola', '50', true,   false,  true]},
      {key:5,   data:['5',  'Pedro',        'Kania',  '50', true,   true,   false]},
      {key:6,   data:['6',  'Julio 2',      'Kania',  '37', true,   true,   true]},
      {key:7,   data:['7',  'Nicolas 2',    'Kania',  '30', false,  false,  false]},
      {key:8,   data:['8',  'Florencia 2',  'Kania',  '20', false,  true,   true]},
      {key:9,   data:['9',  'Luisa 2',      'Pagola', '50', true,   false,  true]},
      {key:10,  data:['10', 'Pedro 2',      'Kania',  '50', true,   true,   false]}
    ]
  }
}


const obtenerDatosDeTabla = async (tableName)=>{
  try{
    const abortController = new AbortController();
    const url = `https://172.16.0.29:6051/Sw3WebApps_v.3.7.5_DESA_REACT/Sw3Commons/Sw3_getTable.php?tabla=${tableName}`;
    const method = 'GET'
    const headers = {
      "Content-type": "application/json; charset=UTF-8",
    }
    const initData = {
      method: method,
      headers: headers,
      signal: abortController?.signal
    }
    console.log('Enviando Datos a WS ',{url, datos:initData})
    const response = await fetch(url,initData);
    const responseJson = await response.json(); 
    if(!responseJson ) throw new Error('No responseJson found')
    console.log({responseJson})
    if(responseJson.COD.toString() != '200') {
      throw new Error(`[COD:${responseJson.COD}] :: [DAT:${responseJson.MSG[0]}]`)
    }
    return responseJson;
  } catch(e){
    throw `[Tablas] :: [obtenerDatosDeTabla()] :: ${e.toString()}`;  
  }
}

function Tablas() {
  const {addError, user} = useAppContext();
  const [currentTable,  setCurrentTable] = useState(undefined);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const data = tablaDePrueba()
  const menu = appMenu()

  useSignalEffect(()=>{
    console.log(`SIGNAL_SELECTED_APP_MENU_OPTION_CODE changed to ${SIGNAL_SELECTED_APP_MENU_OPTION_CODE.value}`)
    setIsLoadingData(true);
    setCurrentTable(SIGNAL_SELECTED_APP_MENU_OPTION_CODE.value)
  })

  effect(()=>{
    //setIsLoadingData(true);
  });

  useEffect(()=>{
    if(currentTable) {
      obtenerDatosDeTabla(currentTable).then(
        (e)=>{
          console.log(`Tabla cargada ok ${currentTable}`)
          setIsLoadingData(false);
        }
      ).catch(e=>{
        addError(e.toString());
        console.log(`Tabla cargada error ${currentTable}`)
        setIsLoadingData(false);
      });
    }
  },[currentTable]);

  return (
    <>
    <AppMenu treeData={menu}/>
    <div className='tablas-table-container'>
      {currentTable && <AppTable isLoading={isLoadingData} isMultiRowSelectable={data.IS_MULTI_ROW_SELECTABLE} title={data.TITLE} headers={data.HEADERS} rows={data.ROWS} defaultSortColumnKey={data.DEFAULT_SORT_COLUMN_KEY} defaultSortColumnOrder={data.DEFAULT_SORT_ORDER} /> }
    </div>    
    </>
  )
}

export default Tablas