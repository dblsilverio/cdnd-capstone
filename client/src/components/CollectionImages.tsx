import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row, Spinner } from 'react-bootstrap'
import { deleteImage, getCollection, getImagesFromCollection } from '../clients/apiClient';
import { Image as CImage } from '../models/image'
import { ImageCollection } from '../models/imageCollection'
import Auth from '../utils/auth';
import { FaPen, FaTrash, FaPlus, FaFileUpload } from 'react-icons/fa';

export function CollectionImages({ match }: any) {
    const { params } = match
    const collectionId = params.collectionId
    const [images, setImages] = useState<CImage[]>([]);
    const [collection, setCollection] = useState<ImageCollection | null>(null)

    const [image, setImage] = useState<CImage | null>(null)

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
            {collection ?
                (<h1 style={{ textAlign: 'center' }}> <i>{collection.name} Images</i> <Button variant="info" size="sm"><FaPlus /></Button></h1>)
                :
                (<div style={{ textAlign: 'center' }}><Spinner animation="grow" variant="success" /></div>)
            }
            {
                <Container style={{ marginTop: '50px' }}>
                    {
                        images.map(item =>
                            (
                                <Row style={{ marginBottom: '25px' }} key={item.id}>
                                    <Col md="5">
                                        <Image src={item.filename} fluid thumbnail />
                                    </Col>
                                    <Col md="7">
                                        <div>
                                            <p><b>Title: </b>{item.title}</p>
                                            <p><b>Created: </b>{item.createdAt}</p>
                                            <p><b>Description: </b>{item.description}</p>
                                            <p><b>Detected Text: </b>{item.textContent}</p>
                                            <div style={{ textAlign: 'center' }}>
                                                <small>
                                                    <Button variant="primary" size="sm"><FaFileUpload /></Button>&nbsp;
                                                    <Button variant="warning" size="sm"><FaPen /></Button>&nbsp;
                                                    <Button variant="danger" size="sm" onClick={async () => { if (await delImage(collection as ImageCollection, item)) setImages(images.filter(ii => ii.id !== item.id)) }}><FaTrash /></Button>
                                                </small>
                                            </div>
                                        </div>
                                    </Col>

                                </Row>
                            )
                        )
                    }
                </Container>
            }
        </>
    )


}

async function delImage(collection: ImageCollection, image: CImage): Promise<boolean> {
    const confirm: boolean = window.confirm(`Confirm deleting image '${image.title}'?`)

    if (confirm) {
        await deleteImage(collection.id, image.id, new Auth().getToken())

        return true
    }

    return false
}