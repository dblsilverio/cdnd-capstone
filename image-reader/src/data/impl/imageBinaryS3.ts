import * as AWS from 'aws-sdk'
import { Logger } from "winston";
import { createLogger } from "../../utils/infra/logger";
import { ImageBinaryRepository } from "../imageBinaryRepository";

export class ImageBinaryS3 implements ImageBinaryRepository {

    constructor(
        private readonly logger: Logger = createLogger("ImageBinaryS3"),
        private readonly bucketName: string = process.env.IMAGES_BUCKET_NAME,
        private readonly expirationTime: string = process.env.SIGNED_URL_EXPIRATION,
        private readonly s3Client: AWS.S3 = createS3Client()
    ) { }

    signedUrl(imageId: string): string {
        this.logger.debug(`Generating signed url for image ${imageId}`)

        return this.s3Client.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: parseInt(this.expirationTime)
        })
    }

}

function createS3Client(): AWS.S3 {
    return new AWS.S3({ signatureVersion: 'v4' })
}