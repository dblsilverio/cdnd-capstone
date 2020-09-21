import * as AWS from 'aws-sdk'
import { ApiGatewayManagementApi } from 'aws-sdk';
import { Logger } from "winston";
import { createLogger } from "../utils/infra/logger";
import { deleteConnection } from './usersConnectionService';

const logger: Logger = createLogger('svc-webSocketService')

const stage = process.env.STAGE
const apiId = process.env.API_ID

const apiGW: ApiGatewayManagementApi = createApiGatewayClient()

export async function notify(connectionId: string, message: any): Promise<void> {
    const messageStr: string = JSON.stringify(message)

    logger.info(`Sending to userConnection ${connectionId}: ${messageStr}`)

    try {
        await apiGW.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(messageStr)
        }).promise()

    } catch (e) {
        logger.error(`Error posting do websocket: ${JSON.stringify(e)}`)

        if(e.statusCode === 410){
            logger.warn(`Stale connection ${connectionId} will be removed`)

            await deleteConnection(connectionId)
        }
    }

}

function createApiGatewayClient(): ApiGatewayManagementApi {

    const connectionParams = {
        apiVersion: "2018-11-29",
        endpoint: `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`
    }

    return new AWS.ApiGatewayManagementApi(connectionParams)
}