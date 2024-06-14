import React, { useEffect, useRef, useState } from 'react'
import './AppTable.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import { faSortDown, faSortUp, faSquare } from '@fortawesome/free-solid-svg-icons'

export const TABLE_SORT_ORDER = {
    ASC:    'TABLE_SORT_ORDER:ASC',
    DESC:   'TABLE_SORT_ORDER:DESC',
}

export const TABLE_DATA_TYPE = {
    NUMBER:     'TABLE_DATA_TYPE:NUMBER',
    STRING:     'TABLE_DATA_TYPE:STRING',
    DATE:       'TABLE_DATA_TYPE:DATE',
    BOOLEAN:    'TABLE_DATA_TYPE:BOOLEAN',
}

const pageSizes = [
    ,{value:5,      label:'5'}
    ,{value:10,     label:'10'}
    ,{value:50,     label:'50'}
    ,{value:100,    label:'100'}
    ,{value:1000,   label:'1000'}
    ,{value:-1,     label:'Todas'}
]

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

const getPaginationInitialRow = (pageSize, currentPage) => {
    return (pageSize * (currentPage -1)) // 1=>0,2=>10,3=>20 
}
const getPaginationLastRow = (pageSize, currentPage) => {
    return ((pageSize * (currentPage -1)) + (pageSize -1))//1=>9,2=>19
}

const getMaxPage = (rowsLength, pageSize)=>{
    let value = parseInt(rowsLength / pageSize);
    rowsLength % pageSize > 0 ? value ++ : 0;
    return value
}

function AppTable({isLoading, title, headers, rows,isMultiRowSelectable, defaultSortColumnKey, defaultSortColumnOrder, pageSize=5 }) {
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
    const [paginationData,setPaginationData] = useState({
        current: 1,
        size: pageSize,
        maxPage:  getMaxPage(rowsCopy.length, pageSize),
        firstrow: getPaginationInitialRow(pageSize,1),
        lastRow: getPaginationLastRow(pageSize,1),
    });

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
        setRowsState((current)=>{ return current});
    };

    const onPageSizeSelectorChange = (e)=>{
        const pageSizeValue = e.target.value === '-1'? rowsState.length : e.target.value;
        console.log('onPageSizeSelectorChange()',{
            ...paginationData,
            current: 1,
            size: pageSizeValue,
            maxPage:  getMaxPage(rowsState.length, pageSizeValue),
            firstrow: getPaginationInitialRow(pageSizeValue,1),
            lastRow: getPaginationLastRow(pageSizeValue,1),
         })

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
                maxPage:  getMaxPage(rowsCopy.length, currentPaginationData.size),
                firstrow: getPaginationInitialRow(currentPaginationData.size,pageNumberValue),
                lastRow: getPaginationLastRow(currentPaginationData.size,pageNumberValue),
             }
        });
    }

    console.log('rendering',{headersState,rowsState,sortColumnKey, sortColumnOrder,paginationData})


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
                            //.filter((e,i)=>{return i >= paginationData.firstrow && i <= paginationData.lastRow})
                            rowsState.filter((e,i)=>{return i >= paginationData.firstrow && i <= paginationData.lastRow}).map((row,rowIndex)=>{
                                return <tr key={row.key} style={{gridTemplateColumns:styleTrWidth}} data-id={row.data[dataKeyIndex]}>
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

                <select name="pageSizeSelector" id='pageSizeSelector' onChange={onPageSizeSelectorChange} defaultValue={paginationData.size}>
                    {
                        pageSizes.map(size=>{
                            return <option key={size.value} value={size.value} >{size.label}</option>
                        })
                    }
                </select>
            </section>
        </div>
    )
}

export default AppTable