import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { Logger } from 'winston'
import { deleteCollection } from '../../../services/imageCollectionService'
import { getUserId } from '../../../utils/auth/auth'
import { createLogger } from '../../../utils/infra/logger'

const logger: Logger = createLogger("http-deleteCollection")

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(evt)
    const { id } = evt.pathParameters

    try {

        await deleteCollection(id, userId)

        return {
            statusCode: 204,
            body: ''
        }

    } catch (e) {
        logger.error(`Error deleting collection: ${e.message}`)

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