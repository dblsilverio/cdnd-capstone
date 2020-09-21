import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { Logger } from 'winston'
import { createLogger } from '../utils/infra/logger'

const AWSX = AWSXRay.captureAWS(AWS)
const logger: Logger = createLogger("svc-rekognitionService")

const cloudWatchClient = new AWSX.CloudWatch()

const namespace = process.env.NAMESPACE

export async function putTimeMetric(operationName: string, duration: number): Promise<void> {
    await putMetric(operationName, "Duration", duration, "Milliseconds")
}

export async function putCountMetric(operationName: string, count: number = 1): Promise<void> {
    await putMetric(operationName, "Frequency", count, "Count")
}

async function putMetric(operationName: string, metricName: string, metric: number, unit: "Milliseconds" | "Count"): Promise<void> {
    logger.debug(operationName, metric, unit)

    await cloudWatchClient.putMetricData({
        MetricData: [
            {
                MetricName: metricName,
                Dimensions: [
                    {
                        Name: 'OperationName',
                        Value: operationName
                    }
                ],
                Unit: unit,
                Value: metric
            }
        ],
        Namespace: namespace
    }).promise()
}