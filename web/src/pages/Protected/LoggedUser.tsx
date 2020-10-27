import React from 'react'
import { Redirect } from 'react-router-dom'

function LoggedUser  ({component}: any) {
    const Component = component
    const auth = localStorage.getItem('auth-token')
    
    return auth ? (
        <Redirect to={{ pathname: '/landing'}}/>
    ) : (
        <Component/>
    )
}

export default LoggedUser