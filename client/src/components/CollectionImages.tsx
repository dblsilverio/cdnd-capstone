import React, { Component } from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { Image as CImage } from '../models/image'
import { ImageCollection } from '../models/imageCollection'

export default class CollectionImages extends Component {

    collection: ImageCollection = { category: "Category name", name: "Collection name", createdAt: new Date().toISOString(), id: "1231231", userId: "123123", description: "Collection description" }
    images: CImage[] = [
        { collectionId: this.collection.id, filename: "https://udacity-cdnd-capstone-image-reader-dev.s3.amazonaws.com/7293f85e-53e6-463d-8e81-7a325168cc7a", id: "123", createdAt: new Date().toISOString(), title: "Public Sign 1", description: "A public sign bla bla bla", textContent: "Detect Text" },
        { collectionId: this.collection.id, filename: "https://udacity-cdnd-capstone-image-reader-dev.s3.amazonaws.com/7293f85e-53e6-463d-8e81-7a325168cc7a", id: "123", createdAt: new Date().toISOString(), title: "Public Sign 1", description: "A public sign bla bla bla", textContent: "Detect Text" },
        { collectionId: this.collection.id, filename: "https://udacity-cdnd-capstone-image-reader-dev.s3.amazonaws.com/7293f85e-53e6-463d-8e81-7a325168cc7a", id: "123", createdAt: new Date().toISOString(), title: "Public Sign 1", description: "A public sign bla bla bla", textContent: "Detect Text" },
        { collectionId: this.collection.id, filename: "https://udacity-cdnd-capstone-image-reader-dev.s3.amazonaws.com/7293f85e-53e6-463d-8e81-7a325168cc7a", id: "123", createdAt: new Date().toISOString(), title: "Public Sign 1", description: "A public sign bla bla bla", textContent: "Detect Text" },
        { collectionId: this.collection.id, filename: "https://udacity-cdnd-capstone-image-reader-dev.s3.amazonaws.com/7293f85e-53e6-463d-8e81-7a325168cc7a", id: "123", createdAt: new Date().toISOString(), title: "Public Sign 1", description: "A public sign bla bla bla", textContent: "Detect Text" },
        { collectionId: this.collection.id, filename: "https://udacity-cdnd-capstone-image-reader-dev.s3.amazonaws.com/7293f85e-53e6-463d-8e81-7a325168cc7a", id: "123", createdAt: new Date().toISOString(), title: "Public Sign 1", description: "A public sign bla bla bla", textContent: "Detect Text" }
    ]

    render() {
        return (
            <>
                <h1 style={{ textAlign: 'center' }}> <i>{this.collection.name}</i> Images </h1>
                {
                    <Container style={{ marginTop: '50px' }}>
                        {
                            this.images.map(i => (<ImageItem item={i} />))
                        }
                    </Container>
                }
            </>
        )

    }

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
                    <Image src={item.filename} fluid />
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