import React from 'react'
import EmployeeNabar from '../_components/EmployeeNabar'

const layout = ({ children }: { children: React.ReactNode }) => {
    return <>
        <EmployeeNabar />
        {children}
    </>
}

export default layout