import React from "react";
import { IdToken, useAuth0 } from "@auth0/auth0-react";
import { Image } from "react-bootstrap";
import Auth from "../utils/auth";
import WSImageProcessor from "./WSImageProcessor";

/**
 * Base on Auth0 docs for React Integration
 */
const Profile = () => {
    const { user, isAuthenticated } = useAuth0()
    const auth = new Auth()

    if (isAuthenticated) {
        BearerToken().then(tokenInfo => auth.setTokenInfo(tokenInfo?.token as string, tokenInfo?.userId as string))
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
                        <WSImageProcessor userId={user.sub} />
                    </div >) : (<></>)
            }
        </>
    )

}

export async function BearerToken(): Promise<TokenInfo | null> {
    const { getIdTokenClaims } = useAuth0()
    const idToken: IdToken = await getIdTokenClaims()

    if (idToken) {
        const token: string = idToken.__raw
        const userId: string = idToken.sub as string

        if (token) {
            return { token, userId }
        }
    }

    return null
}

interface TokenInfo {
    token: string
    userId: string
}


export default Profile