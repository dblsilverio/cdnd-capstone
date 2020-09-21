import { APIGatewayProxyResult } from 'aws-lambda'
import { Logger } from 'winston'
import { putCountMetric } from '../../services/metricService'

export async function handleErrors(e: Error, logger: Logger): Promise<APIGatewayProxyResult> {
    logger.error(`Error fetching collection: ${e.message}`)

    if (e && e.name === "Error") {
        logger.error(`Internal server error: ${e.message}`)

        await putCountMetric(`Server Error - ${e.name}`)

        return {
            statusCode: 500,
            body: 'Internal Server Error :('
        }

    } else {
        logger.debug(`Bypassing exception ${e.name}`)

        throw e
    }
}