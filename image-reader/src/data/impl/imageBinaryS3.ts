import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { Logger } from "winston";
import { traceCount } from '../../utils/decorators';
import { createLogger } from "../../utils/infra/logger";
import { ImageBinaryRepository } from "../imageBinaryRepository";

const AWSX = AWSXRay.captureAWS(AWS)

export class ImageBinaryS3 implements ImageBinaryRepository {

    constructor(
        private readonly logger: Logger = createLogger("ImageBinaryS3"),
        private readonly bucketName: string = process.env.IMAGES_BUCKET_NAME,
        private readonly expirationTime: string = process.env.SIGNED_URL_EXPIRATION,
        private readonly s3Client: AWS.S3 = createS3Client()
    ) { }

    getBucket(): string {
        return this.bucketName
    }

    @traceCount("Generated Signed Urls")
    signedUrl(imageId: string): string {
        this.logger.debug(`Generating signed url for image ${imageId}`)

        return this.s3Client.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: parseInt(this.expirationTime)
        })
    }

    @traceCount("Deleting Image from S3")
    deleteImage(imageId: string) {
        this.logger.debug(`Deleting image binary for image ${imageId}`)
        this.s3Client.deleteObject({
            Bucket: this.bucketName,
            Key: imageId
        })
    }

}

function createS3Client(): AWS.S3 {
    return new AWSX.S3({ signatureVersion: 'v4' })
}