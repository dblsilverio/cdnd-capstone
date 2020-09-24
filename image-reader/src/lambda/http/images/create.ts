import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { Logger } from 'winston'
import { ImageRequest } from '../../../requests/imageRequest'
import { CreateImageResponse } from '../../../response/createImageResponse'
import { createImage } from '../../../services/ImageService'
import { getUserId } from '../../../utils/auth/auth'
import { handleErrors } from '../../../utils/errors/errors'
import { createLogger } from '../../../utils/infra/logger'

const logger: Logger = createLogger('http-createImage')

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const imageRequest: ImageRequest = JSON.parse(evt.body)
    const userId = getUserId(evt)

    try {
        const { collectionId } = evt.pathParameters

        const resp: CreateImageResponse = await createImage(imageRequest, collectionId, userId)

        return {
            statusCode: 201,
            body: JSON.stringify({
                ...resp
            })
        }
    } catch (e) {
        return await handleErrors(e, logger)
    }
})

handler.use(cors({ credentials: true })).use(httpErrorHandler())