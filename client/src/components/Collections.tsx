import React, { Component } from 'react'
import { Button, Card, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { deleteCollection, getCollections, updateCollection, createCollection } from '../clients/apiClient'
import { ImageCollection } from '../models/imageCollection'
import Auth from '../utils/auth'
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';
import { CollectionRequest } from '../models/collectionRequest'
import { toast } from 'react-toastify'

export class Collections extends Component<any> {

    state: any = {
        collections: [],
        loading: true,
        editing: false,
        newCollection: true,
        collection: {
            name: '',
            category: '',
            description: ''
        }
    }

    async _loadCollections() {
        const collections = await getCollections(new Auth().getToken());

        this.setState({
            ...this.state,
            collections,
            loading: false
        })
    }

    async componentDidMount() {
        await this._loadCollections()
    }

    _create(collection: ImageCollection | null) {

        if (collection && collection.id) {
            this.setState({
                ...this.state,
                editing: true,
                collection,
                newCollection: false
            })
        } else if (collection) {
            this.setState({
                ...this.state,
                editing: true,
                collection,
                newCollection: true
            })
        }else {
            this.setState({
                ...this.state,
                editing: false,
                newCollection: true,
                collection: {
                    name: '',
                    category: '',
                    description: ''
                }
            })
        }
    }

    _updateState(evt: any) {
        const { name, value } = evt.target
        const { collection } = this.state

        this.setState({
            collection: {
                ...collection,
                [name]: value
            }
        })
    }

    async _delCollection(collection: ImageCollection): Promise<boolean> {
        const confirm: boolean = window.confirm(`Confirm deleting collection '${collection.name}'?`)

        if (confirm) {
            await deleteCollection(collection.id, new Auth().getToken())

            return true
        }

        return false
    }

    async _save(c: ImageCollection) {
        const { id, name, category, description } = this.state.collection
        const cReq: CollectionRequest = { name, category, description }
        const token: string = new Auth().getToken()

        let result: boolean = false
        if (id) {
            result = await updateCollection(id, cReq, token)
        } else {
            result = await createCollection(cReq, token)
        }


        if (result) {
            toast.success(`Collection was persisted`)
        } else {
            toast.error(`Error with collection operation. Try again later.`)
        }

        await this._loadCollections()
        this._create(null)

    }

    render() {

        const modalTitle = this.state.newCollection ? 'New Collection' : this.state.collection.name

        return (
            <>
                <h1 style={{ textAlign: 'center' }}>My Collections <Button variant="info" size="sm" onClick={() => this._create({} as ImageCollection)}><FaPlus /></Button></h1>
                <Container>
                    <Row>
                        {
                            this.state.loading ?
                                (<Col md="12"><div style={{ textAlign: 'center' }}><Spinner animation="grow" variant="success" /></div></Col>)
                                :
                                this.state.collections.map((c: ImageCollection) => (
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
                                                        <Button variant="warning" size="sm" onClick={() => this._create(c)}><FaPen /></Button> &nbsp;
                                                <Button variant="danger" size="sm" onClick={async () => await this._delCollection(c)}><FaTrash /></Button>
                                                    </small>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                        }
                    </Row>
                </Container>
                <Modal show={this.state.editing} onHide={() => this._create(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="form-group row">
                                <label htmlFor="collName" className="col-4 col-form-label">Name</label>
                                <div className="col-8">
                                    <input id="collName" name="name" placeholder="Collection Name" type="text" required className="form-control" value={this.state.collection.name} onChange={this._updateState.bind(this)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="collCategory" className="col-4 col-form-label">Category</label>
                                <div className="col-8">
                                    <select id="collCategory" name="category" className="custom-select" required value={this.state.collection.category} onChange={this._updateState.bind(this)}>
                                        <option value="BOOKS">Books</option>
                                        <option value="INSTRUCTIONS">Instructions</option>
                                        <option value="PERSONAL">Personal</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="description" className="col-4 col-form-label">Description</label>
                                <div className="col-8">
                                    <textarea id="collDescription" name="description" className="form-control" value={this.state.collection.description} onChange={this._updateState.bind(this)}></textarea>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this._create(null)}>
                            Close
              </Button>
                        <Button variant="primary" onClick={() => this._save(this.state.collection)}>
                            {this.state.newCollection ? 'Save' : 'Update'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}