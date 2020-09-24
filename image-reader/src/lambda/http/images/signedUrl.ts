import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { Logger } from 'winston'
import { createSignedUrl } from '../../../services/ImageService'
import { getUserId } from '../../../utils/auth/auth'
import { handleErrors } from '../../../utils/errors/errors'
import { createLogger } from '../../../utils/infra/logger'

const logger: Logger = createLogger('http-createImage')

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(evt)

    try {
        const { collectionId, imageId } = evt.pathParameters

        const signedUrl: string = await createSignedUrl(imageId, collectionId, userId)

        return {
            statusCode: 200,
            body: JSON.stringify({
                signedUrl
            })
        }
    } catch (e) {
        return await handleErrors(e, logger)
    }
})

handler.use(cors({ credentials: true })).use(httpErrorHandler())