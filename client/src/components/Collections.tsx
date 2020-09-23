import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { deleteCollection, getCollections } from '../clients/apiClient'
import { ImageCollection } from '../models/imageCollection'
import Auth from '../utils/auth'
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';

export function Collections() {


    
    const [collections, setCollections] = useState(new Array<ImageCollection>());
    const [loading, setLoading] = useState(true)

    const [editing, setEditing] = useState(false)
    const [collection, setCollection] = useState<ImageCollection | null>(null)

    useEffect(() => {
        const getColls = async () => {
            const colls = await getCollections(new Auth().getToken());

            setCollections(colls)
            setLoading(false)
        }

        getColls()
    }, [])

    const create = (c: ImageCollection | null) => {
        if (c) {
            setEditing(true)
            setCollection(c)
        } else {
            setEditing(false)
            setCollection(null)
        }
    }

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>My Collections <Button variant="info" size="sm"><FaPlus /></Button></h1>
            <Container>
                <Row>
                    {
                        loading ?
                            (<Col md="12"><div style={{ textAlign: 'center' }}><Spinner animation="grow" variant="success" /></div></Col>)
                            :
                            collections.map(c => (
                                <Col md="4" xs="12" key={c.id}>
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
                                                    <Button variant="warning" size="sm" onClick={() => create(c)}><FaPen /></Button> &nbsp;
                                                <Button variant="danger" size="sm" onClick={async () => { if (await delCollection(c)) setCollections(collections.filter(cc => cc.id !== c.id)) }}><FaTrash /></Button>
                                                </small>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                    }
                </Row>
            </Container>
            <ModalCollection show={editing} handleClose={() => create(null)} collection={collection} />
        </>
    )
}

function initialValue(isNew: boolean, collection: any) {
    
    if (!isNew) {
        let { name, category, description } = collection
        console.log(name)
        return { name, category, description }
    } else {
        return { name: '', category: '', description: '' }
    }

}

function ModalCollection({ show, handleClose, collection }: any) {

    const newColl: boolean = !collection
    const [state, setState] = useState(initialValue(newColl, collection))
    console.log(useState(initialValue(newColl, collection)))

    console.log(newColl, collection, state)

    const modalTitle = newColl ? 'New Collection' : state.name

    const updateState = (e: any) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group row">
                            <label htmlFor="collName" className="col-4 col-form-label">Name</label>
                            <div className="col-8">
                                <input id="collName" name="collName" placeholder="Collection Name" type="text" required className="form-control" value={state.name} onChange={updateState} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="collCategory" className="col-4 col-form-label">Category</label>
                            <div className="col-8">
                                <select id="collCategory" name="collCategory" className="custom-select" required value={state.category} onChange={updateState}>
                                    <option value="BOOKS">Books</option>
                                    <option value="INSTRUCTIONS">Instructions</option>
                                    <option value="PERSONAL">Personal</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="collDescription" className="col-4 col-form-label">Description</label>
                            <div className="col-8">
                                <textarea id="collDescription" name="collDescription" className="form-control" value={state.description} onChange={updateState}></textarea>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
              </Button>
                    <Button variant="primary" onClick={handleClose}>
                        {newColl ? 'Save' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

async function delCollection(collection: ImageCollection): Promise<boolean> {
    const confirm: boolean = window.confirm(`Confirm deleting collection '${collection.name}'?`)

    if (confirm) {
        await deleteCollection(collection.id, new Auth().getToken())

        return true
    }

    return false
}