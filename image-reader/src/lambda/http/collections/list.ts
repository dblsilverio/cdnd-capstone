import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../../../utils/auth/auth'

import { ImageCollection } from '../../../models/imageCollection'
import { getUserCollections } from '../../../services/imageCollectionService'


export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(evt)

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
})

handler.use(cors({ credentials: true }))