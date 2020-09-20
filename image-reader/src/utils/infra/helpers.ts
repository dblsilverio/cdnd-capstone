const bucketName = process.env.IMAGES_BUCKET_NAME

export function completeImageUrl(filename: string): string {
    return `https://${bucketName}.s3.amazonws.com/${filename}`
}