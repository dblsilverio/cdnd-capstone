import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { Logger } from 'winston'
import { ImageRequest } from '../../../requests/imageRequest'
import { updateImage } from '../../../services/ImageService'
import { getUserId } from '../../../utils/auth/auth'
import { handleErrors } from '../../../utils/errors/errors'
import { createLogger } from '../../../utils/infra/logger'

const logger: Logger = createLogger('http-updateImage')

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const imageRequest: ImageRequest = JSON.parse(evt.body)
    const userId = getUserId(evt)

    try {
        const { collectionId, imageId } = evt.pathParameters

        await updateImage(imageId, collectionId, userId, imageRequest)

        return {
            statusCode: 204,
            body: ''
        }
    } catch (e) {
    return await handleErrors(e, logger)
}
})

handler.use(cors({ credentials: true })).use(httpErrorHandler())