import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { ApiGatewayManagementApi } from 'aws-sdk';
import { Logger } from "winston";
import { createLogger } from "../utils/infra/logger";
import { deleteConnection } from './usersConnectionService';

const AWSX = AWSXRay.captureAWS(AWS)
const logger: Logger = createLogger('svc-webSocketService')

const stage = process.env.STAGE
const apiId = process.env.API_ID

const apiGW: ApiGatewayManagementApi = createApiGatewayClient()

export async function notify(connectionId: string, message: any): Promise<boolean> {

    logger.info(`Sending to userConnection ${connectionId}: ${JSON.stringify(message)}`)

    try {
        await apiGW.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(message)
        }).promise()

        return true

    } catch (e) {
        logger.error(`Error posting do websocket: ${JSON.stringify(e)}`)

        if (e.statusCode === 410) {
            logger.warn(`Stale connection ${connectionId} will be removed`)

            await deleteConnection(connectionId)
        }
    }

    return false

}

function createApiGatewayClient(): ApiGatewayManagementApi {

    const connectionParams = {
        apiVersion: "2018-11-29",
        endpoint: `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`
    }

    return new AWSX.ApiGatewayManagementApi(connectionParams)
}