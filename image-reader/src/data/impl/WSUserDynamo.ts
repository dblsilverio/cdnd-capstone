import * as AWS from 'aws-sdk'
import { DocumentClient, QueryOutput } from "aws-sdk/clients/dynamodb";
import { Logger } from 'winston';
import { createLogger } from '../../utils/infra/logger';
import { WSUserRepository } from "../WSUserRepository";

export class WSUserDynamo implements WSUserRepository {

    constructor(
        private readonly logger: Logger = createLogger('WSUserDynamo'),
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly tableName: string = process.env.USERS_CONNECTIONS_TABLE,
        private readonly connectionByUserIdIndexName: string = process.env.USERS_ID_INDEX_NAME
    ) { }

    async put(connectionId: string, userId: string): Promise<void> {
        this.logger.info(`Registering ws connection for id ${connectionId} / ${userId}`)

        const startedAt: string = new Date().toISOString()

        await this.docClient.put({
            TableName: this.tableName,
            Item: {
                id: connectionId,
                userId,
                startedAt
            }
        }).promise()
    }

    async activeConnections(userId: string): Promise<string[]> {

        const result: QueryOutput = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.connectionByUserIdIndexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        if (result.Count !== 0) {
            return result.Items.map(r => <string>r["id"])
        }

        return []
    }

    async delete(connectionId: string): Promise<void> {
        this.logger.info(`Removing ws connection for id ${connectionId}`)

        await this.docClient.delete({
            TableName: this.tableName,
            Key: {
                id: connectionId
            }
        }).promise()
    }

}

function createDynamoDBClient(): DocumentClient {
    let params = undefined

    if (process.env.IS_OFFLINE) {
        params = {
            region: "offline",
            endpoint: "http://localhost:8000"
        }
    }

    return new AWS.DynamoDB.DocumentClient(params)
}