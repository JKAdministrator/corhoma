import React, { useEffect, useRef, useState } from 'react'
import './AppTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AppTable({isLoading, title, headers, rows,isMultiRowSelectable }) {
    headers = headers ? [...headers] : [];
    rows = rows ? [...rows] : [];

    if(isMultiRowSelectable){
        headers.unshift({key:'', label:'selector',align:'center', width:'5rem', isKey:false});
        rows.forEach(row=>{
            row.data.unshift(false) // add if checked or not the row
        });
    }
    const styleTrWidth =  headers.map(h=>{return h.width}).join(' '); 
    const dataKeyIndex = headers.findIndex((e)=>{return e.isKey});

    const [isTableLoading,setIsTableLoading] = useState(isLoading);
    const [rowsStateData,setRowsStateData] = useState(rows);
    const [allRowsSelected,setAllRowsSelected] = useState(false);
    const isFirstRender = useRef(true);  // Usamos useRef para mantener la bandera de la primera renderización


    useEffect(()=>{
        if (isFirstRender.current) {
            isFirstRender.current = false; // Cambiamos la bandera después de la primera renderización
            return; // No ejecutamos el efecto en la primera renderización
        } 
        console.log('useEffect(),[rowsStateData]');
        let allSelected = false;
        if(isMultiRowSelectable){
            allSelected = rowsStateData.reduce((valorAnterior, valorActual, indice, vector)=>{
                return valorAnterior && valorActual.data[0]
            },true)
            console.log(`allSelected ${allSelected}`)
            setAllRowsSelected(allSelected)
        }
        return () => {};
    },[rowsStateData])

    const onChangeSelectAll = (e)=>{
        console.log('F2: onChangeSelectAll()')
        let newValue = e.target.checked;
        setRowsStateData((currentRowStateData)=>{
            let newData = currentRowStateData.map(row=>{
                return {...row, data:row.data.map((e,i)=>{return i==0? newValue : e}) }
            })
            return newData
        })
    }
    const onChangeSelectOne = (e)=>{
        console.log('F1: onChangeSelectOne()')
        let newValue = e.target.checked;
        let dataId = e.target.parentNode.parentNode.dataset.id 
        setRowsStateData((currentRowStateData)=>{
            let selectedElementIndex = currentRowStateData.findIndex(row=>{return row.key == dataId;});
            let newData = [...currentRowStateData]
            newData[selectedElementIndex].data[0] = newValue;
            return JSON.parse(JSON.stringify(newData));
        });
    }

    console.log('rendering...')












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
                            {headers.map((h,i)=>{
                                if(i==0 && isMultiRowSelectable){
                                    return <th key={h.key || i}><input type='checkbox' checked={allRowsSelected} onChange={onChangeSelectAll}></input> </th>
                                }
                                return <th key={h.key || i}>{h.label}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rowsStateData.map((row,rowIndex)=>{
                                return <tr key={row.key || rowIndex } style={{gridTemplateColumns:styleTrWidth}} data-id={row.data[dataKeyIndex]}>
                                {
                                    row.data.map((data, dataIndex)=>{
                                        if(dataIndex == 0 && isMultiRowSelectable){
                                            return <td key={dataIndex} data-type="rowSelector"> 
                                                <input type="checkbox" name={`row_${dataIndex}`} id={`row_${dataIndex}`} checked={data} onChange={onChangeSelectOne}/>
                                            </td>
                                        }

                                        if(headers[dataIndex].isAction){
                                            return <td key={dataIndex} data-type="action"> 
                                                {
                                                    <button type="button" disabled={!data}><FontAwesomeIcon icon={headers[dataIndex].icon} /></button>
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
        </div>
    )
}

export default AppTable