"use client"
import { useTodoUpdateMutation } from '@/redux/apis/admin.api'
import { useGetTodosQuery, useUpdateTodoMutation } from '@/redux/apis/employee.api'
import { TOGGLE_TODO_REQUEST } from '@/types/Employee'
import { format } from 'date-fns'
import React from 'react'
import { toast } from 'react-toastify'
const { isBefore } = require("date-fns")

const EmployeeDashboard = () => {
    const { data } = useGetTodosQuery()
    const [update, { isLoading }] = useUpdateTodoMutation()
    const handleUpdate = async (data: TOGGLE_TODO_REQUEST) => {
        try {
            await update(data).unwrap()
            toast.success("Task update success")
        } catch (error) {
            console.log(error)
            toast.success(" Unable to  update Task")

        }
    }

    return <div className='container my-3'>
        {
            data && <table className='table-bordered mx-1 my-1'>
                <thead>
                    <tr>
                        <th>_id</th>
                        <th>task</th>
                        <th>desc</th>
                        <th>priority</th>
                        <th>employee</th>
                        <th>due</th>
                        <th>completeDate</th>
                        <th>complete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.result.map(item => <tr key={item._id}
                            className={`${item.completeDate && isBefore(item.completeDate || new Date(), item.due) ? "table-success" : "table-danger"}`}>
                            <td>{item._id}</td>
                            <td>{item.task}</td>
                            <td>{item.desc}</td>
                            <td>{item.priority}</td>
                            <td>{item.employee.name}</td>
                            <td>{format(item.due, "dd-MMMM-yyyy")}</td>
                            <td>{item.completeDate && format(item.completeDate, "dd-MMMM-yyyy")}</td>
                            <td>{
                                item.complete
                                    ? "Completed"
                                    : <button onClick={e => handleUpdate({ _id: item._id, complete: true })} className='btn btn-success btn-sm'>Mark Complete</button>

                            }</td>
                            <td>
                                {item.completeDate || new Date && isBefore(item.completeDate, item.due)
                                    ? "No"
                                    : "YEs"
                                }
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
        }
    </div >
}

export default EmployeeDashboard