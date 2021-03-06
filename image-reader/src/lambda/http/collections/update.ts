import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { Logger } from 'winston'
import { CollectionRequest } from '../../../requests/collectionRequest'
import { updateCollection } from '../../../services/imageCollectionService'
import { getUserId } from '../../../utils/auth/auth'
import { handleErrors } from '../../../utils/errors/errors'
import { createLogger } from '../../../utils/infra/logger'

const logger: Logger = createLogger("http-updateCollection")

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const { collectionId } = evt.pathParameters
    const collectionRequest: CollectionRequest = JSON.parse(evt.body)
    const userId = getUserId(evt)

    try {
        await updateCollection(collectionRequest, collectionId, userId)

        return {
            statusCode: 204,
            body: ''
        }

    } catch (e) {
        return await handleErrors(e, logger)
    }

})

handler.use(cors({ credentials: true })).use(httpErrorHandler())