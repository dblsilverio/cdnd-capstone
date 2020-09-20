import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../../../utils/auth/auth'

import { getUserCollection } from '../../../services/imageCollectionService'
import { ImageCollection } from '../../../models/imageCollection'
import { Logger } from 'winston'
import { createLogger } from '../../../utils/infra/logger'
import { handleErrors } from '../../../utils/errors/errors'

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
        return await handleErrors(e, logger)
    }

})

handler.use(cors({ credentials: true })).use(httpErrorHandler())