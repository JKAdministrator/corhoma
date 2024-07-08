import React, { useEffect, useState } from 'react'
import AppTable, {TABLE_SORT_ORDER, TABLE_DATA_TYPE, TABLE_PAGE_SIZES} from '../../../../components/appTable/AppTable';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import './Tablas.css'
import { effect, useSignalEffect } from "@preact/signals-react";
import AppMenu, {SIGNAL_SELECTED_APP_MENU_OPTION_CODE} from '../../../../components/appMenu/AppMenu.jsx'
import { useAppContext } from '../../../../AppContext.jsx'
import { useApiPrivateContext  } from '../../../../apiContexts/ApiPrivateContext.jsx'
import { useNavigate, useParams} from 'react-router-dom';
import { useApiPublicContext } from '../../../../apiContexts/ApiPublicContext.jsx';



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


function Tablas() {
  const {addError, getTokens} = useAppContext();
  const { loading, API_ADM_TABLAS} = useApiPrivateContext();
  const { API_TEST } = useApiPublicContext();
  const [ loadingComponent, setLoadingComponent]  = useState(true);

  const { id } = useParams();
  const [currentTable,  setCurrentTable] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [tableWebServiceResponse,  setTableWebServiceResponse] = useState(undefined);
  const navigate = useNavigate();
  const menu = appMenu();

  useSignalEffect(()=>{
    if(SIGNAL_SELECTED_APP_MENU_OPTION_CODE.value) navigate(`/app/Sw3AdmTablas/${SIGNAL_SELECTED_APP_MENU_OPTION_CODE.value}`);
  })

  useEffect(()=>{
    if(!loading) setLoadingComponent(false);
  },[loading]);

  if(id !== currentTable) setCurrentTable(id);

  useEffect(()=>{
    if(currentTable && !loadingComponent){
      /*API_TEST.test_config().then(testResponse=>{
        console.log('testResponse [on PAGE TABLAS]',testResponse);
      }).catch(e=>{
        console.log('testResponse ERROR [on PAGE TABLAS]',testResponse);
      })*/
      API_ADM_TABLAS.getTable(currentTable).then(
        (respuesta)=>{
          if(respuesta.cod != '200') {
            addError(respuesta.err.toString());
            setIsLoadingData(true);
          } else {
            const headers = respuesta.dat.metadata.headers.map((header)=>{return {label:'?', key:'?', dataType:TABLE_DATA_TYPE.STRING, isKey:false, sortable:false ,alig:'center', width:'7rem', ...header} });
            headers[(headers.length -1)].width = '1fr';
            const rows = respuesta.dat.rows;
            const title = `${respuesta.dat.metadata.title}` ;
            setTableWebServiceResponse({headers, rows, title});
            setIsLoadingData(false);
          }
        }
      ).catch(e=>{
        addError(e.toString());
        console.log(`Tabla cargada error`);
        setIsLoadingData(true);
      });
    }
  },[loadingComponent, currentTable])
  
  
  return (
    <>
    <AppMenu treeData={menu}/>
    <div className='tablas-table-container'>
      {currentTable && tableWebServiceResponse && <AppTable isLoading={isLoadingData} isMultiRowSelectable={false} title={tableWebServiceResponse?.title} headers={tableWebServiceResponse?.headers} rows={tableWebServiceResponse?.rows} defaultSortColumnKey={'COD'} defaultSortColumnOrder={TABLE_SORT_ORDER.ASC} pageSize={TABLE_PAGE_SIZES.ROWS_ALL} /> }
    </div>    
    </>
  )
}

export default Tablas