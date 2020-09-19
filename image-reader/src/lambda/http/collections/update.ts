import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { Logger } from 'winston'
import { CollectionRequest } from '../../../requests/collectionRequest'
import { updateCollection } from '../../../services/imageCollectionService'
import { getUserId } from '../../../utils/auth/auth'
import { createLogger } from '../../../utils/infra/logger'

const logger: Logger = createLogger("http-updateCollection")

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const { id } = evt.pathParameters
    const collectionRequest: CollectionRequest = JSON.parse(evt.body)
    const userId = getUserId(evt)

    try {
        await updateCollection(collectionRequest, id, userId)

        return {
            statusCode: 204,
            body: ''
        }

    } catch (e) {
        logger.error(`Error updating collection: ${e.message}`)

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