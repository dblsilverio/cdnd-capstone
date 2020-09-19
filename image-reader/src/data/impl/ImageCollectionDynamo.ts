import * as AWS from 'aws-sdk'
import { DocumentClient, GetItemOutput, QueryOutput } from "aws-sdk/clients/dynamodb"
import { ImageCollection } from "../../models/imageCollection"
import { ImageCollectionRepository } from "../imageCollectionRepository"
import { Logger } from 'winston'
import { createLogger } from '../../utils/infra/logger'
import { AuthorizationError } from '../../utils/errors/authorizationError'
import { NotFoundError } from '../../utils/errors/notFoundError'

export class ImageCollectionDynamo implements ImageCollectionRepository {

    constructor(
        private readonly logger: Logger = createLogger("ImageCollectionDynamo"),
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly tableName: string = process.env.COLLECTION_TABLE_NAME,
        private readonly collectionIdIndexName: string = process.env.COLLECTION_ID_INDEX_NAME,
        private readonly userCollectionIndexName: string = process.env.USER_INDEX_NAME
    ) { }

    async create(i: ImageCollection): Promise<ImageCollection> {

        await this.docClient.put({
            TableName: this.tableName,
            Item: i
        }).promise()

        return i
    }

    async get(id: string, userId: string): Promise<ImageCollection> {

        this.checkOwner(userId, id)

        const result: GetItemOutput = await this.docClient.get({
            TableName: this.tableName,
            Key: { id, userId }
        }).promise()

        if (result.Item) {
            return <ImageCollection>(<unknown>result.Item)
        }

        return null
    }

    async list(userId: string): Promise<ImageCollection[]> {

        const result: QueryOutput = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.userCollectionIndexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        if (result.Count !== 0) {
            return <ImageCollection[]>(<unknown>result.Items)
        }

        return []
    }

    async update(i: ImageCollection, userId: string): Promise<void> {

        this.checkOwner(userId, i.id);

        await this.docClient.update({
            TableName: this.tableName,
            Key: { id: i.id, userId },
            UpdateExpression: 'set #name = :name, description = :description, category = :category',
            ExpressionAttributeValues: {
                ':name': i.name,
                ':description': i.description,
                ':category': i.category
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            }
        }).promise()
    }

    async delete(id: string, userId: string): Promise<void> {

        this.checkOwner(userId, id);

        await this.docClient.delete({
            TableName: this.tableName,
            Key: { id, userId }
        }).promise()
    }

    async checkOwner(userId: string, id: string): Promise<void> {

        console.log(userId, id)

        const result: QueryOutput = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.collectionIdIndexName,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id
            }
        }).promise()

        console.log(result)

        if (result.Count !== 0) {
            const imageCol: ImageCollection = <ImageCollection>(<any>result.Items[0])
            console.log(imageCol)

            if (imageCol.userId !== userId) {
                this.logger.warn(`User ${userId} is not owner of collection ${id}`)
                throw new AuthorizationError(`Unauthorized operation`)
            }
        } else {
            throw new NotFoundError(`ImageCollection#${id}`)
        }

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