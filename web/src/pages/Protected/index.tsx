import React from 'react'
import { Redirect } from 'react-router-dom'

function Protected  ({component}: any) {
    const Component = component
    const auth = localStorage.getItem('auth-token')

    return auth ? (
        <Component />
    ) : (
        <Redirect to={{ pathname: '/'}}/>
    )
}

export default Protected