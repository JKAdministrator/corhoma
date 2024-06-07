import React from 'react'
import AppTable from '../../../../components/appTable/AppTable';

function Tablas() {
  const IS_LOADING = false;
  const TITLE = 'Datos del Cliente';
  const HEADERS = [
    {key:'ID', label:'Id', align:'center'},
    {key:'FIRSTNAME', label:'Nombre', align:'left'},
    {key:'FAMILYNAME', label:'Apellido', align:'left'},
    {key:'AGE', label:'Edad', align:'center'}
  ]
  const DATA = [
    {key:1, data:['1','Julio','Kania','37']},
    {key:2, data:['1','Nicolas','Kania','30']},
    {key:3, data:['1','Florencia','Kania','20']},
    {key:4, data:['1','Luisa','Pagola','50']},
    {key:5, data:['1','Pedro','Kania','50']}
  ]

  return (
    <div>
      <AppTable isLoading={IS_LOADING} title={TITLE} headers={HEADERS} rows={DATA} />
    </div>
  )
}

export default Tablas