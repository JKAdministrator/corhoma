import React, { useState } from 'react'
import './AppTable.css';
function AppTable({isLoading, title, headers, rows, actions }) {

    const [isTableLoading,setIsTableLoading] = useState(isLoading)
    return (

        <div className='app-table'>
            {
                !isTableLoading && 
                <table>
                    <caption>
                        {title}
                    </caption>
                    <thead>
                        <tr>
                            {headers.map((h,i)=>{
                                return <th key={h.key || i}>{h.label}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.map((r,i)=>{
                                return <tr key={r.key || i }>
                                {
                                    r.data.map((rd, i)=>{
                                        return <td key={i} style={{textAlign:headers[i].align || 'center'}}> {rd}</td>
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