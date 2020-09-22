import React, { Component, useEffect, useState } from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { getCollection, getImagesFromCollection } from '../clients/apiClient';
import { Image as CImage } from '../models/image'
import { ImageCollection } from '../models/imageCollection'
import Auth from '../utils/auth';

export function CollectionImages({ match }: any) {
    const { params } = match
    const collectionId = params.collectionId
    const [images, setImages] = useState<CImage[]>([]);
    const [collection, setCollection] = useState<ImageCollection | null>(null)

    useEffect(() => {
        const getImages = async () => {
            const token: string = new Auth().getToken()

            const ims = await getImagesFromCollection(collectionId, token);
            const collection = await getCollection(collectionId, token)
            setImages(ims)
            setCollection(collection)
        }

        getImages()
    }, [collectionId])

    return (
        <>
            <h1 style={{ textAlign: 'center' }}> <i>{collection ? collection.name : 'N/A'}</i> Images </h1>
            {
                <Container style={{ marginTop: '50px' }}>
                    {
                        images.map(i => (<ImageItem key={i.id} item={i} />))
                    }
                </Container>
            }
        </>
    )


}

type ImageProps = {
    item: CImage
}

class ImageItem extends Component<ImageProps> {

    render() {

        const { item } = this.props

        return (
            <Row style={{ marginBottom: '25px' }}>
                <Col md="5">
                    <Image src={item.filename} fluid thumbnail />
                </Col>
                <Col md="7">
                    <div>
                        <p><b>Title: </b>{item.title}</p>
                        <p><b>Created: </b>{item.createdAt}</p>
                        <p><b>Description: </b>{item.description}</p>
                        <p><b>Detected Text: </b>{item.textContent}</p>
                    </div>
                </Col>

            </Row>
        )
    }
}