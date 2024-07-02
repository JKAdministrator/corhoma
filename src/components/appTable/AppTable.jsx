import React, { useEffect, useRef, useState } from 'react'
import './AppTable.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import { faSortDown, faSortUp, faSquare } from '@fortawesome/free-solid-svg-icons'



/* -- ejemplo de tabla 
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
  */

export const TABLE_SORT_ORDER = {
    ASC:    'TABLE_SORT_ORDER:ASC',
    DESC:   'TABLE_SORT_ORDER:DESC',
}

export const TABLE_DATA_TYPE = {
    NUMBER:     'NUMBER',
    STRING:     'STRING',
    DATE:       'DATE',
    BOOLEAN:    'BOOLEAN',
}

export const pageSizes = [
    {value:5,      label:'5'}
    ,{value:10,     label:'10'}
    ,{value:50,     label:'50'}
    ,{value:100,    label:'100'}
    ,{value:1000,   label:'1000'}
    ,{value:-1,     label:'Todas'}
]

export const TABLE_PAGE_SIZES =  {
    ROWS_5:     0,
    ROWS_10:    1,
    ROWS_50:    2,
    ROWS_100:   3,
    ROWS_1000:  4,
    ROWS_ALL:   5
}

const addCheckbox = (headers, rows)=>{
    headers.unshift({key:'', label:'selector',align:'center', width:'5rem', isKey:false});
    rows.forEach(row=>{
        row.data.unshift(false) // add if checked or not the row
    });
}

const castToTableType = (value='0',dataType=TABLE_DATA_TYPE.STRING  )=>{
    switch(dataType){
        case TABLE_DATA_TYPE.STRING:{
            return value.toString().toUpperCase();
            break;
        }
        case TABLE_DATA_TYPE.NUMBER:{
            return Number(value);
            break;
        }
        case TABLE_DATA_TYPE.BOOLEAN:{
            return value? true : false;
            break;
        }
        case TABLE_DATA_TYPE.DATE:{
            return new Date(value);
            break;
        }
        default: {
            return value.toString().toUpperCase();
            break;
        } 
    }
}

const sortRows = (rows, headers, sortColumnKey, sortColumnOrder )=>{
    const index = headers.findIndex((header)=>{return header.key.toString().toUpperCase() == sortColumnKey.toString().toUpperCase()})
    rows.sort((rowA, rowB) => {
        if(castToTableType(rowA.data[index], headers[index].dataType) >= castToTableType(rowB.data[index], headers[index].dataType)){
            return sortColumnOrder === TABLE_SORT_ORDER.ASC ? 1 : -1
        } else {
            return sortColumnOrder === TABLE_SORT_ORDER.ASC ? -1 : 1
        }
    });
    return [...rows]
}

const getPaginationInitialRow = (pageSize, currentPage) => {
    if(pageSize===-1) return 0;
    return (pageSize * (currentPage -1)) // 1=>0,2=>10,3=>20 
}
const getPaginationLastRow = (pageSize, currentPage) => {
    if(pageSize===-1) return 99999999;
    return ((pageSize * (currentPage -1)) + (pageSize -1))//1=>9,2=>19
}

const getMaxPage = (rowsLength, pageSize)=>{
    if(pageSize === -1) return 1
    let value = parseInt(rowsLength / pageSize);
    rowsLength % pageSize > 0 ? value ++ : 0;
    return value;
}

function AppTable({isLoading, title, headers, rows,isMultiRowSelectable, defaultSortColumnKey, defaultSortColumnOrder, pageSize=TABLE_PAGE_SIZES.ROWS_ALL }) {

    if(isMultiRowSelectable) addCheckbox(headers, rows);

    const styleTrWidth =  headers.map(h=>{return h.width}).join(' '); 
    const dataKeyIndex = headers.findIndex((e)=>{return e.isKey});

    const [rowsState,setRowsState] = useState(sortRows(rows, headers,defaultSortColumnKey, defaultSortColumnOrder));
    const [headersState,setHeadersState] = useState(headers);

    const [isTableLoading,setIsTableLoading] = useState(isLoading);
    const [allRowsSelected,setAllRowsSelected] = useState(false);
    const [sortColumnKey,setSortColumnKey] = useState(defaultSortColumnKey);
    const [sortColumnOrder,setSortColumnOrder] = useState(defaultSortColumnOrder);
    const [paginationData,setPaginationData] = useState({
        current: 1,
        size: pageSizes[pageSize],
        maxPage:  getMaxPage(rows.length, pageSizes[pageSize].value),
        firstrow: getPaginationInitialRow(pageSizes[pageSize].value,1),
        lastRow: getPaginationLastRow(pageSizes[pageSize].value,1),
    });

    const isFirstRender = useRef(true);  // Usamos useRef para mantener la bandera de la primera renderización


    useEffect(()=>{
        if (isFirstRender.current) {
            isFirstRender.current = false; // Cambiamos la bandera después de la primera renderización
            return; // No ejecutamos el efecto en la primera renderización
        }

        let allSelected = false;
        if(isMultiRowSelectable){
            allSelected = rowsState.reduce((valorAnterior, valorActual, indice, vector)=>{
                return valorAnterior && valorActual.data[0]
            },true)
            setAllRowsSelected(allSelected);
        }
        return () => {};
    },[rowsState])

    useEffect(()=>{
        console.log('apptable useEffect rows');
        setRowsState(sortRows(rows, headers,sortColumnKey, sortColumnOrder));
    },[rows]);

    useEffect(()=>{
        console.log('apptable useEffect rows');
        setHeadersState(headers);
    },[headers]);

    useEffect(()=>{
        console.log('apptable useEffect isLoading');
        setIsTableLoading(isLoading);
    },[isLoading]);

    const onChangeSelectAll = (e)=>{
        let newValue = e.target.checked;
        setRowsState((currentRowStateData)=>{
            let newData = currentRowStateData.map(row=>{
                return {...row, data:row.data.map((e,i)=>{return i==0? newValue : e}) }
            })
            return newData
        })
    }
    const onChangeSelectOne = (e)=>{
        let newValue = e.target.checked;
        let dataId = e.target.parentNode.parentNode.dataset.id 
        setRowsState((currentRowStateData)=>{
            let selectedElementIndex = currentRowStateData.findIndex(row=>{return row.key == dataId;});
            let newData = [...currentRowStateData]
            newData[selectedElementIndex].data[0] = newValue;
            return JSON.parse(JSON.stringify(newData));
        });
    }

    const onSortColumnMouseDown = (e) => {
        const newSortKey = e.target.parentNode.dataset.key;
        const newSortOrder = sortColumnOrder === TABLE_SORT_ORDER.ASC ? TABLE_SORT_ORDER.DESC : TABLE_SORT_ORDER.ASC;
        setSortColumnKey(newSortKey);
        setSortColumnOrder(newSortOrder);
        sortRows(rowsState, headersState, newSortKey,newSortOrder);
        setRowsState((current)=>{ return current});
    };

    const onPageSizeSelectorChange = (e)=>{
        const pageSizeValue = e.target.value === '-1'? rowsState.length : e.target.value;
        setPaginationData((currentPaginationData)=>{
            return {
                ...currentPaginationData,
                current: 1,
                size: pageSizeValue,
                maxPage:  getMaxPage(rowsState.length, pageSizeValue),
                firstrow: getPaginationInitialRow(pageSizeValue,1),
                lastRow: getPaginationLastRow(pageSizeValue,1),
             }
        });
    }

    const onPageSelectorChange = (e)=>{
        const pageNumberValue = e.target.value;
        setPaginationData((currentPaginationData)=>{
            return {
                ...currentPaginationData,
                current: pageNumberValue,
                size: currentPaginationData.size,
                maxPage:  getMaxPage(rows.length, currentPaginationData.size),
                firstrow: getPaginationInitialRow(currentPaginationData.size,pageNumberValue),
                lastRow: getPaginationLastRow(currentPaginationData.size,pageNumberValue),
             }
        });
    }
    console.log('rendering',{rows, rowsState, headers, headersState });

    return (
        <div className={`app-table ${isTableLoading && 'animated-background'}`}>
        {
            !isTableLoading && title ? <h1>{title}</h1> : <></>
        }
            {
                !isTableLoading && 
                <table>
                    <thead>
                        <tr style={{gridTemplateColumns:styleTrWidth}}>
                            {headersState.map((h,i)=>{
                                return <th key={h.key || i} data-key={h.key || i}>
                                    {i==0 && isMultiRowSelectable ? 
                                        <input type='checkbox' checked={allRowsSelected} onChange={onChangeSelectAll} /> 
                                        : 
                                        <button type='button' className={h.key != sortColumnKey? 'disabled' : null} onClick={onSortColumnMouseDown}>
                                            <span htmlFor="">{h.label}</span> 
                                            <FontAwesomeIcon icon={sortColumnOrder===TABLE_SORT_ORDER.ASC ? faSortUp : faSortDown}/>
                                        </button>
                                    }
                                </th>

                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            //.filter((e,i)=>{return i >= paginationData.firstrow && i <= paginationData.lastRow})
                            rowsState.filter((e,i)=>{return i >= paginationData.firstrow && i <= paginationData.lastRow}).map((row,rowIndex)=>{
                                return <tr key={row.data[dataKeyIndex]} style={{gridTemplateColumns:styleTrWidth}} data-id={row.data[dataKeyIndex]}>
                                {
                                    row.data.map((data, dataIndex)=>{
                                        if(dataIndex == 0 && isMultiRowSelectable){
                                            return <td key={dataIndex} data-type="rowSelector"> 
                                                <input type="checkbox" name={`row_${dataIndex}`} id={`row_${dataIndex}`} checked={data} onChange={onChangeSelectOne}/>
                                            </td>
                                        }

                                        if(headersState[dataIndex].isAction){
                                            return <td key={dataIndex} data-type="action"> 
                                                {
                                                    <button type="button" disabled={!data}><FontAwesomeIcon icon={headersState[dataIndex].icon} /></button>
                                                }
                                            </td>
                                        } 
                                        return <td key={dataIndex} style={{justifyContent:headers[dataIndex]?.align || 'center'}}> {data}</td>
                                    })
                                }</tr>
                            })
                        }
                    </tbody>
                </table>
   
            }
            {!isTableLoading && 
            <section>
                <label>{paginationData.firstrow+1} - {paginationData.lastRow+1 > rowsState.length ? rowsState.length : paginationData.lastRow+1} de {rowsState.length} registros</label>
                <label htmlFor="pageSelector"> Página :</label>
                <select name="pageSelector" id='pageSelector' onChange={onPageSelectorChange} defaultValue={1}>
                    {
                        [...Array(paginationData.maxPage)].map((_, i) => {return  {key:(i+1).toString(), value:(i + 1), label:(i+1).toString()}})
                        .map(i => <option key={i.key} value={i.value} >{i.label}</option>)
                    }
                </select>
                <label> / {paginationData.maxPage}</label>
                <label htmlFor="pageSizeSelector"> Registros por página :</label>

                <select name="pageSizeSelector" id='pageSizeSelector' onChange={onPageSizeSelectorChange} defaultValue={paginationData.size.value}>
                    {
                        pageSizes.map(size=>{
                            return <option key={size.value} value={size.value} >{size.label}</option>
                        })
                    }
                </select>
            </section>
            }
        </div>
    )
}

export default AppTable