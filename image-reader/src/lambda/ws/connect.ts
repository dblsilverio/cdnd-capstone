import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as createHttpError from 'http-errors'
import { Logger } from 'winston'
import { putConnection } from '../../services/usersConnectionService'
import { createLogger } from '../../utils/infra/logger'

const logger: Logger = createLogger('ws-disconnect')

export const handler: APIGatewayProxyHandler = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId: string = evt.queryStringParameters.userId
  logger.info('Websocket connect', evt)

  if (!userId) {
    throw new createHttpError.BadRequest(`Provide correct UserID`);
  }

  const { connectionId } = evt.requestContext

  await putConnection(connectionId, userId)

  return {
    statusCode: 200,
    body: ''
  }
}
