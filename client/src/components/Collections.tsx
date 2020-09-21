import React, { Component } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ImageCollection } from '../models/imageCollection'

export default class Collections extends Component {

    items: ImageCollection[] = [
        { category: "Category name", name: "Collection name", createdAt: new Date().toISOString(), id: "1231231", userId: "123123", description: "Collection description" },
        { category: "Category name", name: "Collection name", createdAt: new Date().toISOString(), id: "1231231", userId: "123123", description: "Collection description" },
        { category: "Category name", name: "Collection name", createdAt: new Date().toISOString(), id: "1231231", userId: "123123", description: "Collection description" },
        { category: "Category name", name: "Collection name", createdAt: new Date().toISOString(), id: "1231231", userId: "123123", description: "Collection description" },
        { category: "Category name", name: "Collection name", createdAt: new Date().toISOString(), id: "1231231", userId: "123123", description: "Collection description" },
        { category: "Category name", name: "Collection name", createdAt: new Date().toISOString(), id: "1231231", userId: "123123", description: "Collection description" }
    ]

    render() {
        return (
            <>
                <h1 style={{ textAlign: 'center' }}>My Collections <Button variant="info">+</Button></h1>
                <Container>
                    <Row>
                        {
                            this.items.map(c => (<CollectionItem item={c} />))
                        }
                    </Row>
                </Container>
            </>
        )

    }

}

type CollectionProps = {
    item: ImageCollection
}

class CollectionItem extends Component<CollectionProps> {

    render() {

        const { item } = this.props

        return (
            <>
                <Col md="4" xs="12">
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>
                                {item.name}
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{item.category}</Card.Subtitle>
                            <Card.Text>
                                {item.description}
                            </Card.Text>
                            <Card.Link as={Link} to={`/collections/${item.id}`}>Check Images</Card.Link>
                            <div style={{textAlign: 'right'}}>
                                <small>
                                    <Button variant="warning" size="sm">O</Button>
                                    <Button variant="danger" size="sm">X</Button>
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </>
        )
    }
}