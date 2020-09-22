import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { deleteCollection, getCollections } from '../clients/apiClient'
import { ImageCollection } from '../models/imageCollection'
import Auth from '../utils/auth'

export function Collections() {
    const [collections, setCollections] = useState(new Array<ImageCollection>());

    useEffect(() => {
        const getColls = async () => {
            const colls = await getCollections(new Auth().getToken());

            setCollections(colls)
        }

        getColls()
    }, [])

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>My Collections <Button variant="info">+</Button></h1>
            <Container>
                <Row>
                    {
                        collections.map(c => (
                            <Col md="4" xs="12">
                                <Card style={{ width: '18rem' }}>
                                    <Card.Body>
                                        <Card.Title>
                                            {c.name}
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{c.category}</Card.Subtitle>
                                        <Card.Text>
                                            {c.description}
                                        </Card.Text>
                                        <Card.Link as={Link} to={`/collections/${c.id}`}>Check Images</Card.Link>
                                        <div style={{ textAlign: 'right' }}>
                                            <small>
                                                <Button variant="warning" size="sm">O</Button>
                                                <Button variant="danger" size="sm" onClick={async () => { if (await delCollection(c)) setCollections(collections.filter(cc => cc.id !== c.id)) }}>X</Button>
                                            </small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                        ))
                    }
                </Row>
            </Container>
        </>
    )
}

async function delCollection(collection: ImageCollection): Promise<boolean> {
    const confirm: boolean = window.confirm(`Confirm deleting collection '${collection.name}'?`)

    if (confirm) {
        await deleteCollection(collection.id, new Auth().getToken())

        return true
    }

    return false
}