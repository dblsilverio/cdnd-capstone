import { Image } from "../models/image";
import { ImageCollection } from "../models/imageCollection";

export interface CollectionsImagesState {
    images: Image[]
    image: Image | null
    collection: ImageCollection | null
    editing: boolean
    newImage: boolean
    loading: boolean
    upload: boolean
    uploading: boolean
    file: Buffer | null
}

export interface CollectionsImagesProps {
    match: {
        params: {
            collectionId: string
        }
    }
}

export interface CollectionsState {
    collections: ImageCollection[],
    loading: boolean,
    editing: boolean,
    newCollection: boolean,
    collection: ImageCollection
}

export interface WSImageProcessorProps {
    userId: string
}

export interface WSPayload {
    message: string
}