import React from "react";
import { IdToken, useAuth0 } from "@auth0/auth0-react";
import { Image } from "react-bootstrap";
import Auth from "../utils/auth";

/**
 * Base on Auth0 docs for React Integration
 */
const Profile = () => {
    const { user, isAuthenticated } = useAuth0()
    const auth = new Auth()

    if (isAuthenticated) {
        BearerToken().then(token => auth.setToken(token))
    } else {
        auth.removeToken()
    }

    return (
        <>
            {
                isAuthenticated ? (
                    <div>
                        <Image src={user.picture} alt={user.name} width="32" height="32" roundedCircle />
                        <span><b>{user.name}</b>({user.email})</span>
                    </div >) : (<></>)
            }
        </>
    )

}


export async function BearerToken(): Promise<string> {
    const { getIdTokenClaims } = useAuth0()
    const idToken: IdToken = await getIdTokenClaims()

    if (idToken) {
        const token: string = idToken.__raw

        if (token) {
            return token
        }
    }

    return ""

}


export default Profile