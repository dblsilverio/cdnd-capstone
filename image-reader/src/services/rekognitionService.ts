import * as AWS from 'aws-sdk'
import { DetectTextRequest, DetectTextResponse, S3Object } from 'aws-sdk/clients/rekognition';
import { Logger } from 'winston';
import { createLogger } from '../utils/infra/logger';

const logger: Logger = createLogger("svc-rekognitionService")

export async function detectText(image: S3Object): Promise<string> {

    const rk = new AWS.Rekognition()

    const detectRequest: DetectTextRequest = {
        Image: {
            S3Object: image
        }
    }
    logger.debug(detectRequest)

    const response: DetectTextResponse = await rk.detectText(detectRequest).promise()

    logger.debug(response)

    let detectedText = ""

    for (let text of response.TextDetections) {
        if(text.Type === "LINE"){
            detectedText += `\n${text.DetectedText}`
        } 
    }

    return detectedText

}
