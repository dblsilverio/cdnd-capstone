import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const Main = () => {

    const { isAuthenticated } = useAuth0();

    return (
        <>
            {
                isAuthenticated ? (<Redirect to="/collections" />) : (<h3 style={{ textAlign: 'center' }} > Login to continue</h3>)
            }
        </>
    )

}

export default Main