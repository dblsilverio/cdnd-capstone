import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from 'middy/middlewares'


export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event)
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Ok"
        })
    }

})

handler.use(cors({ credentials: true }))