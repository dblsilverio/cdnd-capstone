import * as AWS from 'aws-sdk'

import { DocumentClient, QueryOutput } from "aws-sdk/clients/dynamodb";
import { Image } from "../../models/image";
import { ImageRepository } from "../imageRepository";

export class ImageDynamo implements ImageRepository {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly tableName: string = process.env.IMAGES_TABLE_NAME,
        private readonly findImageByIdIndexName: string = process.env.IMAGES_FIND_ID_INDEX_NAME,
        private readonly imagesCreatedAtCollIndexName: string = process.env.IMAGES_COLLECTION_INDEX_NAME
    ) { }

    async create(i: Image): Promise<Image> {

        await this.docClient.put({
            TableName: this.tableName,
            Item: i
        }).promise()

        return i

    }

    async get(imageId: string): Promise<Image> {

        const result: QueryOutput = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.findImageByIdIndexName,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': imageId
            }
        }).promise()

        if (result.Count === 1) {
            return <Image>(<any>result.Items[0])
        }

        return null

    }

    async list(collectionId: string): Promise<Image[]> {
        const result: QueryOutput = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.imagesCreatedAtCollIndexName,
            KeyConditionExpression: 'collectionId = :cid',
            ExpressionAttributeValues: {
                ':cid': collectionId
            }
        }).promise()

        if (result.Count !== 0) {
            return <Image[]>(<any>result.Items)
        }

        return []
    }

    async delete(collectionId: string, id: string): Promise<void> {

        await this.docClient.delete({
            TableName: this.tableName,
            Key: { id, collectionId }
        }).promise()

    }

    async detectedText(id: string, text: string): Promise<void> {
        const collectionId: string = (await this.get(id)).collectionId

        await this.docClient.update({
            TableName: this.tableName,
            Key: {
                id, collectionId
            },
            UpdateExpression: 'set textContent = :txtContent',
            ExpressionAttributeValues: {
                ':txtContent': text
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