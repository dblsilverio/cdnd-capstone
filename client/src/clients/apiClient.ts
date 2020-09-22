import Axios, { AxiosResponse } from "axios";
import { Image } from "../models/image";
import { ImageCollection } from "../models/imageCollection";

import { apiEndpoint } from '../config/config'

export async function getCollection(collectionId: string, token: string): Promise<ImageCollection | null> {
    const result: AxiosResponse = await Axios.get(`${apiEndpoint}/collections/${collectionId}`, {
        headers: await _headers(token)
    })

    if (result.status === 200) {
        return result.data
    }

    return null;
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

export async function deleteCollection(collectionId: string, token: string): Promise<void> {
    const result: AxiosResponse = await Axios.delete(`${apiEndpoint}/collections/${collectionId}`, {
        headers: await _headers(token)
    })

    if (result.status !== 204) {
        alert(`Error deleting collection: ${result.statusText}`)
    }
}

export async function getImagesFromCollection(collectionId: string, token: string): Promise<Image[]> {
    const result: AxiosResponse = await Axios.get(`${apiEndpoint}/collections/${collectionId}/images`, {
        headers: await _headers(token)
    })

    if (result.status === 200) {
        return result.data
    }

    return [];
}

function _headers(token: string) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}