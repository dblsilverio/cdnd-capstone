import { Image } from "../models/image";

export interface ImageRepository {
    create(i: Image): Promise<Image>
    detectedText(imageId: string, text: string): Promise<void>
    list(collectionId: string): Promise<Image[]>
    delete(collectionId: string, imageId: string): Promise<void>
    collection(imageId: string): Promise<string>
}