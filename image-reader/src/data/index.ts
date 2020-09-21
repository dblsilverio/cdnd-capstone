import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { ImageCollectionRepository } from './imageCollectionRepository'
import { ImageCollectionDynamo } from './impl/imageCollectionDynamo'
import { ImageRepository } from './imageRepository'
import { ImageDynamo } from './impl/imageDynamo'
import { WSUserRepository } from './WSUserRepository'
import { WSUserDynamo } from './impl/WSUserDynamo'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSX = AWSXRay.captureAWS(AWS)

export { ImageCollectionRepository, ImageCollectionDynamo, ImageRepository, ImageDynamo, WSUserRepository, WSUserDynamo }

export function createDynamoDBClient(): DocumentClient {
    let params = undefined

    if (process.env.IS_OFFLINE) {
        params = {
            region: "offline",
            endpoint: "http://localhost:8000"
        }
    }

    return new AWSX.DynamoDB.DocumentClient(params)
}