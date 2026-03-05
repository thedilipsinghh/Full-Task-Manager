"use client"
import { useTodoReadQuery } from '@/redux/apis/admin.api'
import { useGetTodosQuery } from '@/redux/apis/employee.api'
import React, { useState } from 'react'
import { string } from 'zod'

const EmployeeDashboard = () => {
    const { data } = useTodoReadQuery()
    console.log(data)
    const [active, setActive] = useState(false as boolean);

    const toggle = () => {
        setActive(prev => !prev)
    };
    const isComplete = () => {
        {
            data?.result.map(item => item.complete = active)
        }
    }
    return <>
        {
            data && <table className='table-bordered table-cell'>
                <thead>
                    <tr>
                        <th>_id</th>
                        <th>task</th>
                        <th>desc</th>
                        <th>priority</th>
                        <th>name</th>
                        <th>mobile</th>
                        <th>complete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.result.map(item => <tr>
                            <td>{item._id}</td>
                            <td>{item.task}</td>
                            <td>{item.desc}</td>
                            <td>{item.priority}</td>
                            <td>{item.employee.name}</td>
                            <td>{item.employee.mobile}</td>
                            <td>
                                {
                                    item.complete
                                        ? <button onClick={isComplete} type='button' className='btn btn-success btn-sm'>Complete</button>
                                        : <button onClick={isComplete} type='button' className='btn btn-danger btn-sm'>In-Complete</button>
                                }
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
        }
    </>
}

export default EmployeeDashboard