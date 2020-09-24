import Axios, { AxiosResponse } from "axios";
import { Image } from "../models/image";
import { ImageCollection } from "../models/imageCollection";

import { apiEndpoint } from '../config/config'
import { CollectionRequest } from "../models/collectionRequest";
import { ImageRequest } from "../models/imageRequest";

export async function getCollection(collectionId: string, token: string): Promise<ImageCollection | null> {
    const result: AxiosResponse = await Axios.get(`${apiEndpoint}/collections/${collectionId}`, {
        headers: await _headers(token)
    })

    if (result.status === 200) {
        return result.data
    }

    console.error(result.statusText)
    return null;
}

export async function createCollection(collection: CollectionRequest, token: string): Promise<boolean> {
    const result: AxiosResponse = await Axios.post(`${apiEndpoint}/collections`, collection, {
        headers: await _headers(token)
    })

    if (result.status === 201) {
        return true
    }

    console.error(result.statusText)
    return false;
}

export async function updateCollection(collectionId: string, collection: CollectionRequest, token: string): Promise<boolean> {
    const result: AxiosResponse = await Axios.put(`${apiEndpoint}/collections/${collectionId}`, collection, {
        headers: await _headers(token)
    })

    if (result.status === 204) {
        return true
    }

    console.error(result.statusText)
    return false;
}

export async function getCollections(token: string): Promise<ImageCollection[]> {

    const result: AxiosResponse = await Axios.get(`${apiEndpoint}/collections`, {
        headers: await _headers(token)
    })

    if (result.status === 200) {
        return result.data
    }

    return [];
}

export async function deleteCollection(collectionId: string, token: string): Promise<boolean> {
    const result: AxiosResponse = await Axios.delete(`${apiEndpoint}/collections/${collectionId}`, {
        headers: await _headers(token)
    })

    if (result.status === 204) {
        return true
    }

    console.error(result.statusText)
    return false
}

export async function getImagesFromCollection(collectionId: string, token: string): Promise<Image[]> {
    const result: AxiosResponse = await Axios.get(`${apiEndpoint}/collections/${collectionId}/images`, {
        headers: await _headers(token)
    })

    if (result.status === 200) {
        return result.data
    }

    console.error(result.statusText)
    return [];
}

export async function deleteImage(collectionId: string, imageId: string, token: string): Promise<boolean> {
    const result: AxiosResponse = await Axios.delete(`${apiEndpoint}/collections/${collectionId}/images/${imageId}`, {
        headers: await _headers(token)
    })

    if (result.status === 204) {
        return true
    }

    return false
}

function _headers(token: string) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export async function createImage(image: ImageRequest, collectionId: string, token: string): Promise<boolean> {
    const result: AxiosResponse = await Axios.post(`${apiEndpoint}/collections/${collectionId}/images/`, image, {
        headers: await _headers(token)
    })

    if (result.status === 200) {
        return true
    }

    console.error(result.statusText)
    return false;
}

export async function updateImage(imageId: string, collectionId: string, image: ImageRequest, token: string): Promise<boolean> {
    const result: AxiosResponse = await Axios.put(`${apiEndpoint}/collections/${collectionId}/images/${imageId}`, image, {
        headers: await _headers(token)
    })

    if (result.status === 204) {
        return true
    }

    console.error(result.statusText)
    return false;
}

export async function uploadFile(imageId: string, collectionId: string, file: Buffer, token: string): Promise<boolean> {
    const resultSigned: AxiosResponse = await Axios.post(`${apiEndpoint}/collections/${collectionId}/images/${imageId}/signedUrl`, {}, {
        headers: await _headers(token)
    })

    if (resultSigned.status === 200) {
        const { signedUrl } = resultSigned.data
        const resultUpload: AxiosResponse = await Axios.put(signedUrl, file)

        if (resultUpload.status === 200) {
            return true
        }

        return false
    }

    return false
}