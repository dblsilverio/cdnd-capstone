import * as AWS from 'aws-sdk'

import { DocumentClient } from "aws-sdk/clients/dynamodb";
// import { Logger } from "winston";
import { Image } from "../../models/image";
// import { createLogger } from "../../utils/infra/logger";
import { ImageRepository } from "../imageRepository";

export class ImageDynamo implements ImageRepository {

    constructor(
        // private readonly logger: Logger = createLogger("ImageDynamo"),
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly tableName: string = process.env.IMAGES_TABLE_NAME,
        // private readonly imagesCreatedAtCollIndexName: string = process.env.IMAGES_COLLECTION_INDEX_NAME
    ) { }

    async create(i: Image): Promise<Image> {

        await this.docClient.put({
            TableName: this.tableName,
            Item: i
        }).promise()

        return i

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