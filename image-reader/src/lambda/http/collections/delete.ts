import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { Logger } from 'winston'
import { deleteCollection } from '../../../services/imageCollectionService'
import { getUserId } from '../../../utils/auth/auth'
import { handleErrors } from '../../../utils/errors/errors'
import { createLogger } from '../../../utils/infra/logger'

const logger: Logger = createLogger("http-deleteCollection")

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(evt)
    const { collectionId } = evt.pathParameters

    try {

        await deleteCollection(collectionId, userId)

        return {
            statusCode: 204,
            body: ''
        }

    } catch (e) {
        return await handleErrors(e, logger)
    }

})

handler.use(cors({ credentials: true })).use(httpErrorHandler())