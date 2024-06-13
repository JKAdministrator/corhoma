import React from 'react'
import AppTable, {TABLE_SORT_ORDER, TABLE_DATA_TYPE} from '../../../../components/appTable/AppTable';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import './Tablas.css'

function Tablas() {
  const IS_LOADING = false;
  const IS_MULTI_ROW_SELECTABLE = true;
  const TITLE = 'Datos del Cliente';
  const DEFAULT_SORT_COLUMN_KEY = 'FIRSTNAME';
  const DEFAULT_SORT_ORDER = TABLE_SORT_ORDER.DESC;
  const HEADERS = [
    {key:'ID',          label:'Id',       isKey:true, align:'center', width:'5rem',  isAction:false,  icon:undefined,           sortable:true, dataType:TABLE_DATA_TYPE.NUMBER},
    {key:'FIRSTNAME',   label:'Nombre',   isKey:false, align:'left',   width:'1fr',  isAction:false,  icon:undefined,           sortable:true, dataType:TABLE_DATA_TYPE.STRING},
    {key:'FAMILYNAME',  label:'Apellido', isKey:false, align:'left',   width:'1fr',  isAction:false,  icon:undefined,           sortable:true, dataType:TABLE_DATA_TYPE.STRING},
    {key:'AGE',         label:'Edad',     isKey:false, align:'center', width:'5rem', isAction:false,  icon:undefined,           sortable:true, dataType:TABLE_DATA_TYPE.NUMBER},
    {key:'ACTION_1',    label:'A1',       isKey:false, align:'center', width:'5rem', isAction:true,   icon:faEllipsisVertical,  sortable:true, dataType:TABLE_DATA_TYPE.BOOLEAN},
    {key:'ACTION_2',    label:'A2',       isKey:false, align:'center', width:'5rem', isAction:true,   icon:faEllipsisVertical,  sortable:true, dataType:TABLE_DATA_TYPE.BOOLEAN},
    {key:'ACTION_3',    label:'A3',       isKey:false, align:'center', width:'5rem', isAction:true,   icon:faEllipsisVertical,  sortable:true, dataType:TABLE_DATA_TYPE.BOOLEAN}
  ]
  const ROWS = [
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



  return (
    <div className='tablas-table-container'>
      <AppTable isLoading={IS_LOADING} isMultiRowSelectable={IS_MULTI_ROW_SELECTABLE} title={TITLE} headers={HEADERS} rows={ROWS} defaultSortColumnKey={DEFAULT_SORT_COLUMN_KEY} defaultSortColumnOrder={DEFAULT_SORT_ORDER} />
    </div>
  )
}

export default Tablas