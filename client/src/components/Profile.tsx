import React from "react";
import { IdToken, useAuth0 } from "@auth0/auth0-react";
import { Image } from "react-bootstrap";

/**
 * Base on Auth0 docs for React Integration
 */
const Profile = () => {
    const { user, isAuthenticated } = useAuth0()

    console.log(BearerToken().then(token => console.log(token)))

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