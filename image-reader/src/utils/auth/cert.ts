import Axios, { AxiosResponse } from 'axios'
import { Key } from './key'
import { Jwt } from '../../auth/Jwt'
import { createLogger } from '../infra/logger'

const logger = createLogger('certificate-utils')

export async function getPublicKey(jwksUrl: string, jwt: Jwt): Promise<string> {
    const result: AxiosResponse = await Axios.get(jwksUrl)
    const keys: Key[] = result.data.keys.map(k => { return { kid: k.kid, publicKey: certToPEM(k.x5c[0]) } })
    logger.info(`Retrieved ${keys.length} key(s)`)

    const signingKey = keys.find(k => k.kid === jwt.header.kid);

    if (!signingKey) {
        logger.warning(`Signing key not found for kid '${jwt.header.kid}'`)
    }

    return signingKey.publicKey;
}

/**
 * Based on https://auth0.com/blog/navigating-rs256-and-jwks/ article tips
 * 
 * @param cert 
 */
function certToPEM(cert) {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}