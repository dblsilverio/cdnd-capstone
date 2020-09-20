import { v4 } from 'uuid'
import { ImageCollectionDynamo, ImageCollectionRepository } from '../data';
import { Logger } from "winston";
import { ImageBinaryRepository } from "../data/imageBinaryRepository";
import { ImageRepository } from '../data/imageRepository';
import { ImageBinaryS3 } from "../data/impl/imageBinaryS3";
import { ImageDynamo } from '../data/impl/imageDynamo';
import { Image } from "../models/image";
import { ImageRequest } from "../requests/imageRequest";
import { CreateImageResponse } from '../response/createImageResponse';
import { createLogger } from "../utils/infra/logger";

const logger: Logger = createLogger('svc-imageCollection')
const repo: ImageRepository = new ImageDynamo()
const repoS3: ImageBinaryRepository = new ImageBinaryS3()

const collectionRepo: ImageCollectionRepository = new ImageCollectionDynamo()

export async function createImage(iReq: ImageRequest, collectionId: string, userId: string): Promise<CreateImageResponse> {

    logger.info(`User ${userId} is attempting to create/upload new image: ${iReq.title}`)
    
    collectionRepo.checkOwner(userId, collectionId)

    const id: string = v4()

    const newImage: Image = {
        ...iReq,
        id,
        collectionId,
        filename: id,
        createdAt: new Date().toISOString()
    }

    const image = await repo.create(newImage)
    const signedUrl = repoS3.signedUrl(id)

    return { image, signedUrl };
}