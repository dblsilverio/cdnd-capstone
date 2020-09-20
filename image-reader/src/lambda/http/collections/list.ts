import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../../../utils/auth/auth'

import { ImageCollection } from '../../../models/imageCollection'
import { getUserCollections } from '../../../services/imageCollectionService'
import { handleErrors } from '../../../utils/errors/errors'
import { Logger } from 'winston'
import { createLogger } from '../../../utils/infra/logger'

const logger: Logger = createLogger("http-listCollections")

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(evt)

    try {
        const result: ImageCollection[] = await getUserCollections(userId)

        if (!result) {
            return {
                statusCode: 204,
                body: ''
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    } catch (e) {
        return await handleErrors(e, logger)
    }
})

handler.use(cors({ credentials: true })).use(httpErrorHandler())