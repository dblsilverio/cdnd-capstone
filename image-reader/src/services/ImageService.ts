import { v4 } from 'uuid'
import { ImageCollectionDynamo, ImageCollectionRepository } from '../data';
import { Logger } from "winston";
import { ImageBinaryRepository } from "../data/imageBinaryRepository";
import { ImageRepository, ImageDynamo } from '../data';
import { ImageBinaryS3 } from "../data/impl/imageBinaryS3";
import { Image } from "../models/image";
import { ImageRequest } from "../requests/imageRequest";
import { CreateImageResponse } from '../response/createImageResponse';
import { createLogger } from "../utils/infra/logger";
import { completeImageUrl } from '../utils/infra/helpers';

const logger: Logger = createLogger('svc-imageCollection')
const repo: ImageRepository = new ImageDynamo()
const repoS3: ImageBinaryRepository = new ImageBinaryS3()

const collectionRepo: ImageCollectionRepository = new ImageCollectionDynamo()

export async function findImageById(imageId: string): Promise<Image> {
    return await repo.get(imageId)
}

export async function createImage(iReq: ImageRequest, collectionId: string, userId: string): Promise<CreateImageResponse> {

    logger.info(`User ${userId} is attempting to create new image: ${iReq.title}`)

    await collectionRepo.checkOwner(userId, collectionId)

    const id: string = v4()

    const newImage: Image = {
        ...iReq,
        id,
        collectionId,
        hasImage: false,
        filename: completeImageUrl(id),
        createdAt: new Date().toISOString()
    }

    const image = await repo.create(newImage)

    return { image };
}

export async function createSignedUrl(imageId: string, collectionId: string, userId: string): Promise<string> {

    logger.info(`User ${userId} is generating signed url for image ${imageId}`)

    await collectionRepo.checkOwner(userId, collectionId)

    return repoS3.signedUrl(imageId)
}

export async function updateImage(id: string, collectionId: string, userId: string, iReq: ImageRequest): Promise<void> {
    logger.debug(`User ${userId} is attempting to update image: ${id}`)

    await collectionRepo.checkOwner(userId, collectionId)

    const image: Image = {
        ...iReq,
        id,
        hasImage: false,
        filename: '',
        createdAt: '',
        collectionId: collectionId
    }

    await repo.update(image)
}

export async function deleteImage(imageId: string, collectionId: string, userId: string): Promise<void> {
    logger.debug(`User ${userId} is attempting to delete image: ${imageId}`)

    await collectionRepo.checkOwner(userId, collectionId)

    await repo.delete(collectionId, imageId)
    repoS3.deleteImage(imageId)
}

export async function listCollectionImages(collectionId: string, userId: string): Promise<Image[]> {
    logger.debug(`User ${userId} is listing collection: ${collectionId}`)

    await collectionRepo.checkOwner(userId, collectionId)

    return await repo.list(collectionId)
}

export async function findCollectionOwnerByImage(imageId: string): Promise<string> {
    const collectionId: string = (await repo.get(imageId)).collectionId
    return await collectionRepo.getOwner(collectionId)
}

export async function imageUploaded(imageId: string): Promise<void> {
    logger.info(`Image  binary uploadad for image Id ${imageId}`)

    await repo.imageUploaded(imageId)
}

export async function putDetectedText(imageId: string, detectedText: string): Promise<void> {
    logger.info(`Update image ${imageId} with detect text`)

    await repo.detectedText(imageId, detectedText)
}

export function getBucket(): string {
    return repoS3.getBucket()
}

