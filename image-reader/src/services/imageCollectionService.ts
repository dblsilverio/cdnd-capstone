import { v4 } from 'uuid'
import { ImageCollection } from "../models/imageCollection"
import { CollectionRequest } from '../requests/collectionRequest'
import { ImageCollectionDynamo, ImageCollectionRepository } from '../data'
import { Logger } from 'winston'
import { createLogger } from '../utils/infra/logger'

const logger: Logger = createLogger('svc-imageCollection')
const repo: ImageCollectionRepository = new ImageCollectionDynamo();

export async function createImageCollection(cReq: CollectionRequest, userId: string): Promise<ImageCollection> {

    const imageCollection: ImageCollection = {
        ...cReq,
        id: v4(),
        userId,
        createdAt: new Date().toISOString()
    }

    return await repo.create(imageCollection)
}

export async function getUserCollection(userId: string, id: string): Promise<ImageCollection> {
    return await repo.get(id, userId)
}

export async function getUserCollections(userId: string): Promise<ImageCollection[]> {
    return await repo.list(userId)
}

export async function updateCollection(cReq: CollectionRequest, id: string, userId: string): Promise<void> {
    logger.info(`User ${userId} attempting to update Collection id ${id}`)

    let collection: ImageCollection = {
        ...cReq,
        id,
        createdAt: '',
        userId
    }

    await repo.update(collection, userId);
}

export async function deleteCollection(id: string, userId: string): Promise<void> {
    logger.info(`User ${userId} attempting to delete Collection id ${id}`)

    await repo.delete(id, userId);
}
