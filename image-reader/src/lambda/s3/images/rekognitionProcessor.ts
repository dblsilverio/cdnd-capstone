import { S3EventRecord, SNSEvent, SNSHandler } from "aws-lambda";
import { S3Object } from "aws-sdk/clients/rekognition";
import { Logger } from "winston";
import { ImageRepository } from "../../../data/imageRepository";
import { ImageDynamo } from "../../../data/impl/imageDynamo";
import { getBucket } from "../../../services/ImageService";
import { detectText } from "../../../services/rekognitionService";
import { createLogger } from "../../../utils/infra/logger";

const logger: Logger = createLogger('s3-rekognitionProcessor')
const imageRepo: ImageRepository = new ImageDynamo()

export const handler: SNSHandler = async (evt: SNSEvent) => {

    for (const snsRecord of evt.Records) {
        const recMessage = JSON.parse(snsRecord.Sns.Message)

        for (const s3Record of recMessage.Records) {
            await processImage(s3Record)
        }
    }

}

async function processImage(s3Record: S3EventRecord): Promise<void> {

    const { key } = s3Record.s3.object

    logger.info(`Retrieving image for key ${key}`)
    const s3Object: S3Object = {
        Bucket: getBucket(),
        Name: key
    }
    
    logger.info(`Running rekognition services for image ${key}`)
    const detectedText = await detectText(s3Object)

    if(detectText){
        await imageRepo.detectedText(key, detectedText)
    } else {
        logger.warn(`Could not detect any text for image ${key}`)
    }

}