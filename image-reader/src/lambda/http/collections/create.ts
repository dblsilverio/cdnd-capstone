import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from 'middy/middlewares'
import { Logger } from "winston";

import { ImageCollection } from "../../../models/imageCollection";

import { CollectionRequest } from "../../../requests/collectionRequest";
import { createImageCollection } from "../../../services/imageCollectionService";
import { getUserId } from "../../../utils/auth/auth";
import { createLogger } from "../../../utils/infra/logger";

const logger: Logger = createLogger('http-createCollection')


export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const collectionRequest: CollectionRequest = JSON.parse(evt.body)
    const userId = getUserId(evt);

    logger.info(`User ${userId} creating collection: ${collectionRequest.name}`)

    try {

        const result: ImageCollection = await createImageCollection(collectionRequest, userId)

        return {
            statusCode: 201,
            body: JSON.stringify(result)
        }

    } catch (e) {
        logger.error(`Error creating image collection: ${e.name}: ${e.message}`)

        return {
            statusCode: 500,
            body: ''
        }
    }

});

handler.use(cors({ credentials: true }))