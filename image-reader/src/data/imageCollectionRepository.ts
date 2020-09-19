import { ImageCollection } from "../models/imageCollection";

export interface ImageCollectionRepository {
    create(i: ImageCollection): Promise<ImageCollection>
    get(id: string, userId: string): Promise<ImageCollection>
    list(userId: string): Promise<ImageCollection[]>
    update(i: ImageCollection, userId: string): Promise<void>
    delete(id: string, userId: string): Promise<void>

    checkOwner(userId: string, collectionId: string): Promise<void>
}