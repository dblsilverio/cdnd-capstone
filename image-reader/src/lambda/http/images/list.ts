import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { Image } from '../../../models/image'
import { listCollectionImages } from '../../../services/ImageService'
import { getUserId } from '../../../utils/auth/auth'

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId: string = getUserId(evt)
    const { collectionId } = evt.pathParameters

    const result: Image[] = await listCollectionImages(collectionId, userId)

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }

})

handler.use(cors({ credentials: true })).use(httpErrorHandler())