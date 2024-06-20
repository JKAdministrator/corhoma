import React, { useState } from 'react'
import { signal } from "@preact/signals-react";
import './AppMenu.css'

const findAndChangeViewState = (nodeDataArray, codeToFind)=>{
    nodeDataArray.find((e)=>{
        if(e.key === codeToFind){
            e.isOpen = e.isOpen ? undefined : true
            return 
        }
        if(e.childs) findAndChangeViewState(e.childs, codeToFind)
    })
}

export const SIGNAL_SELECTED_APP_MENU_OPTION_CODE = signal(undefined) 

function AppMenu({treeData}) {


    const [data, setData] = useState([...treeData])

    const createTree = (nodeData, depth)=>{
        return <li key={nodeData.key} className={`depth-${depth}`}>
            <button type='button' onClick={onNodeClick} data-code={nodeData.key} data-action={nodeData.action}>{nodeData.label}</button>
            {nodeData?.childs &&
                <ul className={nodeData.isOpen? 'open' : ''}>
                    {nodeData.childs.map((nodeData2)=>{
                        return createTree(nodeData2, depth +1) 
                    })}
                </ul>
            }
        </li>
    }

    const onNodeClick = (e)=>{
        const action = e.currentTarget.dataset.action;
        const code = e.currentTarget.dataset.code;
        if(!action){
            setData((currentData)=>{
                findAndChangeViewState(currentData,code);
                return [...currentData]
            })
        } else {
            SIGNAL_SELECTED_APP_MENU_OPTION_CODE.value = action;
        }
    }

    return (
        <ul className='app-menu'>
            {data.map(node=>{return createTree(node,0 )})}
        </ul>
    )
}

export default AppMenu