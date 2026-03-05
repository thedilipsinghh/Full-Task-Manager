"use client"
import { useAppSelector } from '@/redux/store'
import Link from 'next/link'
import React from 'react'

const AdminNavbar = () => {
    const { admin } = useAppSelector(state => state.auth)
    return <>
        <nav className="navbar navbar-expand-lg bg-danger navbar-dark">
            <div className="container">
                <a className="navbar-brand" href="#">Admin Panel</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-link active" href="/admin">Dashboard</Link>
                        <Link className="nav-link" href="/admin/employee">Employee</Link>
                        <Link className="nav-link" href="/admin/todo">Todos</Link>
                    </div>
                </div>
                {
                    // admin && <div className='dropdown' data-bs-toggle="dropdown">
                    //     <button className='btn btn-light'>Welcome{admin.name}</button>
                    //     <div className='drowpdown-menu'>
                    //         <li className='dropdown-item'></li>
                    //         <li className='dropdown-item'><li>
                    //             <li className='dropdown-item'></li>
                    //         </div>
                    //     </div>

                    admin && <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            welcome {admin.name}
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Action</a></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><a className="dropdown-item bg-text" href="#">Logout</a></li>
                        </ul>
                    </div>
                }
            </div>
        </nav>
    </>
}

export default AdminNavbar