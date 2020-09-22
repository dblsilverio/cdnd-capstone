export interface ImageBinaryRepository {
    signedUrl(imageId: string): string
    getBucket(): string
    deleteImage(imageId: string)
}