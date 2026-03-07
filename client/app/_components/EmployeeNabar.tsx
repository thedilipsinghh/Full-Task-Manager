"use client"
import { useSignoutMutation } from '@/redux/apis/auth.api'
import { useAppSelector } from '@/redux/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React from 'react'
import { toast } from 'react-toastify'

const EmployeeNabar = () => {
    const { admin } = useAppSelector(state => state.auth)
    const router = useRouter()
    const [signout] = useSignoutMutation()
    const handleLogout = async () => {
        try {
            await signout().unwrap()
            toast.success("Logout Success")
            router.refresh()
        } catch (error) {
            console.log(error)
            toast.error("unable to logout")
        }
    }
    return <>
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
            <div className="container">
                <a className="navbar-brand" href="#">Employee Panel</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link active" href="#"></a>
                        <a className="nav-link" href="/employee/profile">Profile</a>
                        <a className="nav-link" href="/employee">EmpDash</a>
                    </div>
                </div>
                {

                    admin && <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            welcome {admin.name}
                        </button>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" href="/employee">Dashboard</Link></li>
                            <li><Link className="dropdown-item" href="/employee/profile">Profile</Link></li>
                            <li><button onClick={handleLogout} className="dropdown-item text-danger">Logout</button></li>
                        </ul>
                    </div>
                }
            </div>
        </nav>
    </>
}

export default EmployeeNabar