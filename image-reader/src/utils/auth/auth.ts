import { decode } from 'jsonwebtoken'

import { JwtPayload } from '../../auth/JwtPayload'
import { APIGatewayProxyEvent } from "aws-lambda";

/**
 * Extract  bearer token from request
 * @param evt APIGW Event data
 */
export function getUserId(evt: APIGatewayProxyEvent): string {
    const authorization = evt.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    return parseUserId(jwtToken)
}

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
    const decodedJwt = decode(jwtToken) as JwtPayload
    return decodedJwt.sub
}