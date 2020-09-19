import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../../../utils/auth/auth'

import { getUserCollection } from '../../../services/imageCollectionService'
import { ImageCollection } from '../../../models/imageCollection'
import { Logger } from 'winston'
import { createLogger } from '../../../utils/infra/logger'

const logger:Logger = createLogger("http-singleCollection")

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const { id } = evt.pathParameters
    const userId = getUserId(evt)

    try {
        const result: ImageCollection = await getUserCollection(userId, id)

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
        
    } catch (e) {
        logger.error(`Error fetching collection: ${e.message}`)

        switch (e.name) {

            case "AuthorizationError": return {
                statusCode: 403,
                body: ''
            }

            case "NotFoundError": return {
                statusCode: 404,
                body: e.message
            }

            default: return {
                statusCode: 500,
                body: ''
            }

        }
    }

})

handler.use(cors({ credentials: true }))