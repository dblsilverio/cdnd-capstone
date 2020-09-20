import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteImage } from '../../../services/ImageService'
import { getUserId } from '../../../utils/auth/auth'

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId: string = getUserId(evt)
    const { collectionId, imageId } = evt.pathParameters

    await deleteImage(imageId, collectionId, userId)

    return {
        statusCode: 204,
        body: ''
    }

})

handler.use(cors({ credentials: true })).use(httpErrorHandler())