import React, { useEffect, useRef, useState } from 'react'
import './AppTable.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import { faSortDown, faSortUp, faSquare } from '@fortawesome/free-solid-svg-icons'

export const TABLE_SORT_ORDER = {
    ASC: 'TABLE_SORT_ORDER:ASC',
    DESC: 'TABLE_SORT_ORDER:DESC',
}

export const TABLE_DATA_TYPE = {
    NUMBER: 'TABLE_DATA_TYPE:NUMBER',
    STRING: 'TABLE_DATA_TYPE:STRING',
    DATE: 'TABLE_DATA_TYPE:DATE',
    BOOLEAN: 'TABLE_DATA_TYPE:BOOLEAN',
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
    console.log('sortRows()',{index, rows, headers, sortColumnKey, sortColumnOrder})
    return rows
}

function AppTable({isLoading, title, headers, rows,isMultiRowSelectable, defaultSortColumnKey, defaultSortColumnOrder }) {
    const headersCopy = JSON.parse(JSON.stringify(headers));
    const rowsCopy = JSON.parse(JSON.stringify(rows));

    if(isMultiRowSelectable) addCheckbox(headersCopy, rowsCopy);

    const styleTrWidth =  headersCopy.map(h=>{return h.width}).join(' '); 
    const dataKeyIndex = headersCopy.findIndex((e)=>{return e.isKey});

    const [rowsState,setRowsState] = useState(sortRows(rowsCopy, headersCopy,defaultSortColumnKey, defaultSortColumnOrder));
    const [headersState,setHeadersState] = useState(headersCopy);

    const [isTableLoading,setIsTableLoading] = useState(isLoading);
    const [allRowsSelected,setAllRowsSelected] = useState(false);
    const [sortColumnKey,setSortColumnKey] = useState(defaultSortColumnKey);
    const [sortColumnOrder,setSortColumnOrder] = useState(defaultSortColumnOrder);

    const isFirstRender = useRef(true);  // Usamos useRef para mantener la bandera de la primera renderización


    useEffect(()=>{
        if (isFirstRender.current) {
            isFirstRender.current = false; // Cambiamos la bandera después de la primera renderización
            return; // No ejecutamos el efecto en la primera renderización
        } 
        console.log('useEffect() called')
        let allSelected = false;
        if(isMultiRowSelectable){
            allSelected = rowsState.reduce((valorAnterior, valorActual, indice, vector)=>{
                return valorAnterior && valorActual.data[0]
            },true)
            setAllRowsSelected(allSelected)
        }
        return () => {};
    },[null,rowsState])

    const onChangeSelectAll = (e)=>{
        
        console.log('onChangeSelectAll() called ')
        let newValue = e.target.checked;
        setRowsState((currentRowStateData)=>{
            let newData = currentRowStateData.map(row=>{
                return {...row, data:row.data.map((e,i)=>{return i==0? newValue : e}) }
            })
            return newData
        })
    }
    const onChangeSelectOne = (e)=>{
        console.log('onChangeSelectOne() called ')
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
        console.log('onSortColumnMouseDown() called ',{target: e.target})
        const newSortKey = e.target.parentNode.dataset.key;
        const newSortOrder = sortColumnOrder === TABLE_SORT_ORDER.ASC ? TABLE_SORT_ORDER.DESC : TABLE_SORT_ORDER.ASC;
        setSortColumnKey(newSortKey);
        setSortColumnOrder(newSortOrder);
        sortRows(rowsState, headersState, newSortKey,newSortOrder);
        setRowsState((current)=>{
            return current//sortRows(rowsState, headersState, newSortKey,newSortOrder);
        })
    };

    console.log('rendering',{headersState,rowsState,sortColumnKey, sortColumnOrder})
    return (
        <div className='app-table'>
        {
            title ? <h1>{title}</h1> : <></>
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
                            rowsState.map((row,rowIndex)=>{
                                return <tr key={row.key || rowIndex } style={{gridTemplateColumns:styleTrWidth}} data-id={row.data[dataKeyIndex]}>
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
                                        return <td key={dataIndex} style={{justifyContent:headersCopy[dataIndex]?.align || 'center'}}> {data}</td>
                                    })
                                }</tr>
                            })
                        }
                    </tbody>
                </table>
                 
   
            }
        </div>
    )
}

export default AppTable