import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Logger } from 'winston'
import { deleteConnection } from '../../services/usersConnectionService'
import { createLogger } from '../../utils/infra/logger'

const logger: Logger = createLogger('ws-disconnect')

export const handler: APIGatewayProxyHandler = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Websocket disconnect', evt)

  const { connectionId } = evt.requestContext

  await deleteConnection(connectionId)

  return {
    statusCode: 200,
    body: ''
  }
}
