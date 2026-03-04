"use client"
import { useDeleteEmployeeMutation, useGetEmployeesQuery, useRemoveEmployeeMutation, useRestoreEmployeeMutation, useToggleEmployeeStatusMutation } from '@/redux/apis/admin.api'
import { useRegisterEmployeeMutation } from '@/redux/apis/auth.api'
import { DELETE_EMPLOYEE_REQUEST, REMOVE_EMPLOYEE_REQUEST, RESTORE_EMPLOYEE_REQUEST, TOGGLE_EMPLOYEE_REQUEST } from '@/types/Admin'
import { REGISTER_EMPLOYEE_REQUEST } from '@/types/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const AdminEmployee = () => {
    const [selectedEmp, setSelectedEmp] = useState("")
    const { data } = useGetEmployeesQuery()
    const [restoreEmp, { isLoading: restoreLoading }] = useRestoreEmployeeMutation()
    const [deleteEmp, { isLoading: deleteLoading }] = useDeleteEmployeeMutation()
    const [removeEmp, { isLoading: removeLoading }] = useRemoveEmployeeMutation()
    const [registerEmp, { isLoading: registerLoading }] = useRegisterEmployeeMutation()
    const [toggle] = useToggleEmployeeStatusMutation()
    const handleBgColor = (active: boolean, isDelete: boolean) => clsx({
        "table-success": active && !isDelete,
        "table-secondary": !active && !isDelete,
        "table-danger": isDelete,
    })

    const handlerestore = async (data: RESTORE_EMPLOYEE_REQUEST) => {
        try {
            await restoreEmp(data).unwrap()
            toast.success("employe account restore success")
        } catch (error) {
            console.log(error)
            toast.error("unable to restore")
        }
    }
    const handleDelete = async (data: DELETE_EMPLOYEE_REQUEST) => {
        try {
            await deleteEmp(data).unwrap()
            toast.success("employe account delete success")
        } catch (error) {
            console.log(error)
            toast.error("unable to delete")
        }
    }
    const handleRemove = async (data: REMOVE_EMPLOYEE_REQUEST) => {
        try {
            await removeEmp(data).unwrap()
            toast.success("employe account permanant delete success")
        } catch (error) {
            console.log(error)
            toast.error("unable to delete")
        }
    }
    const handleToggle = async (data: TOGGLE_EMPLOYEE_REQUEST) => {
        try {
            await toggle(data).unwrap()
            toast.success("employe status update success")
        } catch (error) {
            console.log(error)
            toast.error("unable to change status")
        }
    }


    const registerSchma = z.object({
        email: z.string().min(1),
        name: z.string().min(1),
        mobile: z.string().min(1)
    }) satisfies z.ZodType<REGISTER_EMPLOYEE_REQUEST>

    const { register, reset, handleSubmit, formState: { errors, touchedFields } } = useForm<REGISTER_EMPLOYEE_REQUEST>({
        resolver: zodResolver(registerSchma),
        defaultValues: {
            email: "",
            name: "",
            mobile: ""
        },

    })
    const handleRegister = async (data: REGISTER_EMPLOYEE_REQUEST) => {
        try {
            await registerEmp(data).unwrap()
            toast.success("register employee success")
            reset()

        } catch (error) {
            console.log(error);
            toast.error(" unabel to register employee")
        }
    }
    const handleClasses = (key: keyof REGISTER_EMPLOYEE_REQUEST) => clsx({
        "form-control my-2": true,
        "is-invalid": errors[key],
        "is-valid": touchedFields[key] && !errors[key],
    })
    return <>
        <div className="container">
            <div className="row">
                <div className="col-sm-6 offset-sm-3">
                    <div className="card mb-3">
                        <div className="card-header">Register Employee</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit(handleRegister)}>
                                <div>
                                    <input {...register("email")} className={handleClasses("email")} type="email" placeholder='email@exampale.com' />
                                    <div className="invalid-feedback">{errors && errors.email?.message}</div>
                                </div>
                                <div>
                                    <input {...register("name")} className={handleClasses("name")} type="name" placeholder='Enter your name' />
                                    <div className="invalid-feedback">{errors && errors.name?.message}</div>
                                </div>
                                <div>
                                    <input {...register("mobile")} className={handleClasses("mobile")} type="name" placeholder='Enter your mobile number' />
                                    <div className="invalid-feedback">{errors && errors.mobile?.message}</div>
                                </div>
                                <button type='submit' className='btn btn-primary w-100'>Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {
                data && <table className='table table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>email</th>
                            <th>mobile</th>
                            <th>role</th>
                            <th>active</th>
                            <th>isDelete</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* active true => green */}
                        {/* active false => gray */}
                        {/* isDelete true => red */}
                        {
                            data.result.map(item => <tr className={handleBgColor(item.active, item.isDelete)} >
                                <td>{item._id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.mobile}</td>
                                <td>{item.role}</td>
                                <td>
                                    {
                                        item.active
                                            ? <button onClick={e => handleToggle({ _id: item._id, status: false })} className='btn btn-sm btn-outline-danger'>block</button>
                                            : <button onClick={e => handleToggle({ _id: item._id, status: true })} className='btn btn-sm btn-success'>un block</button>
                                    }
                                </td>
                                <td>{item.isDelete ? "Yes" : "No"}</td>
                                <td>
                                    {
                                        item.isDelete
                                            ? <div>
                                                <button
                                                    disabled={restoreLoading}
                                                    onClick={() => handlerestore({ _id: item._id, isDelete: false })}
                                                    className='btn  btn-warning btn-sm'>
                                                    {
                                                        restoreLoading
                                                            ? <div className='spinner spinner-border-sm'></div>
                                                            : "Restore"
                                                    }
                                                </button>
                                                <button onClick={e => setSelectedEmp(item._id)} data-bs-toggle="modal" data-bs-target="#deleteModal" className='ms-2 btn btn-sm btn-danger'>Permanant Delete</button>
                                            </div>
                                            : <div>
                                                <button className='btn btn-sm btn-outline-warning'>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button disabled={deleteLoading} onClick={e => handleDelete({ _id: item._id })} className='btn btn-sm btn-outline-danger ms-2'>
                                                    {
                                                        deleteLoading
                                                            ? <div className='spinner spinner-border-sm'></div>
                                                            : <i className="bi bi-trash"></i>
                                                    }
                                                </button>


                                            </div>
                                    }

                                </td>
                            </tr>)
                        }
                    </tbody>

                </table>
            }
        </div>

        <div className="modal fade" id='deleteModal'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">Confirm Permanent Deletion</div>
                    <div className="modal-body">
                        <h6 className='text-danger'>
                            You are about to permanently delete this employee. This action cannot be undone. Do you wish to continue?
                        </h6>
                        <div className='text-end mt-3'>
                            <button onClick={e => handleRemove({ _id: selectedEmp })} data-bs-dismiss="modal" className='btn btn-outline-danger'>Yes, Delete</button>
                            <button data-bs-dismiss="modal" className='ms-2 btn btn-success'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default AdminEmployee