export interface ImageBinaryRepository {
    signedUrl(imageId: string): string
    getBucket(): string
}