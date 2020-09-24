import React, { ChangeEvent, Component } from 'react'
import { Button, Col, Container, Form, Image, Modal, Row, Spinner } from 'react-bootstrap'
import { createImage, deleteImage, getCollection, getImagesFromCollection, updateImage, uploadFile } from '../clients/apiClient';
import { Image as CImage } from '../models/image'
import { ImageCollection } from '../models/imageCollection'
import { FaPen, FaTrash, FaPlus, FaFileUpload } from 'react-icons/fa';
import { ImageRequest } from '../models/imageRequest';
import { toast } from 'react-toastify';
import { CollectionsImagesProps, CollectionsImagesState } from '../types/states';
import { getToken } from '../utils/auth';

export class CollectionImages extends Component<CollectionsImagesProps, CollectionsImagesState> {
    state = {
        images: [],
        image: {
            id: '',
            title: '',
            filename: '',
            createdAt: '',
            description: '',
            collectionId: ''
        },
        collection: {
            id: 'string',
            name: '',
            description: '',
            category: '',
            createdAt: '',
            userId: ''
        },
        editing: false,
        newImage: true,
        loading: true,
        upload: false,
        uploading: false,
        file: null
    }

    async _loadImages() {
        const token: string = getToken()
        const { collectionId } = this.props.match.params

        const images = await getImagesFromCollection(collectionId, token);
        const collection = await getCollection(collectionId, token)

        this.setState({
            ...this.state,
            images,
            collection,
            loading: false
        })
    }

    async componentDidMount() {
        await this._loadImages()
    }

    _create(image: CImage | null) {

        if (image && image.id) {
            this.setState({
                ...this.state,
                editing: true,
                image,
                newImage: false
            })
        } else if (image) {
            this.setState({
                ...this.state,
                editing: true,
                newImage: true
            })
        } else {
            this.setState({
                ...this.state,
                editing: false,
                newImage: true
            })
        }
    }

    _uploadModal(image: CImage | null) {

        if (image) {
            this.setState({
                ...this.state,
                upload: true,
                image
            })
        } else {
            this.setState({
                ...this.state,
                upload: false,
                uploading: false
            })
        }

    }

    /**
     * Base on c4 project
     */
    async _upload() {
        const { id, collectionId } = this.state.image

        if (!this.state.file) {
            toast.warning('File should be selected')
            return
        }

        this.setState({
            ...this.state,
            uploading: true
        })

        try {

            await uploadFile(id, collectionId, (this.state.file as any) as Buffer, getToken())
            toast.success(`File uploaded`)

        } catch (e) {
            console.error(e.message)
            toast.error(`Error uploading file`)
        }

        this._loadImages()
        this._uploadModal(null)

    }

    async _delImage(collection: ImageCollection, image: CImage): Promise<void> {
        const confirm: boolean = window.confirm(`Confirm deleting image '${image.title}'?`)

        if (confirm) {
            if (await deleteImage(collection.id, image.id, getToken())) {
                this.setState({
                    images: this.state.images.filter((ii: CImage) => ii.id !== image.id)
                })

                toast.success("Image deleted")
            } else {
                toast.error("Error deleting image")
            }
        }

    }

    _updateState(evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = evt.target
        const { image } = this.state

        this.setState({
            image: {
                ...image,
                [name]: value
            }
        })
    }

    /**
     * Base on c4 project
     * 
     * @param evt
     */
    async _updateFile(evt: ChangeEvent<HTMLInputElement>) {
        const files = evt.target.files
        if (!files) return

        this.setState({
            ...this.state,
            file: Buffer.from(await files[0].arrayBuffer())
        })
    }

    async _save() {
        const { id, title, description } = this.state.image
        const { id: collectionId } = this.state.collection
        const iReq: ImageRequest = { title, description }
        const token: string = getToken()

        let result: boolean = false
        if (id) {
            result = await updateImage(id, collectionId, iReq, token)
        } else {
            result = await createImage(iReq, collectionId, token)
        }

        if (result) {
            toast.success(`Image was persisted`)
        } else {
            toast.error(`Error with collection operation. Try again later.`)
        }

        await this._loadImages()
        this._create(null)

    }


    render() {

        const imageCollection: ImageCollection = this.state.collection as ImageCollection
        const modalTitle = this.state.newImage ? 'New Image' : this.state.image.title

        return (
            <>
                {this.state.collection ?
                    (<h1 style={{ textAlign: 'center' }}> <i>{imageCollection.name} Images</i> <Button variant="info" size="sm" onClick={() => this._create({} as CImage)}><FaPlus /></Button></h1>)
                    :
                    (<div style={{ textAlign: 'center' }}><Spinner animation="grow" variant="success" /></div>)
                }
                {
                    <Container style={{ marginTop: '50px' }}>
                        {
                            this.state.loading ?
                                (<Col md="12"><div style={{ textAlign: 'center' }}><Spinner animation="grow" variant="success" /></div></Col>)
                                :
                                this.state.images.map((item: CImage) =>
                                    (
                                        <Row style={{ marginBottom: '25px' }} key={item.id}>
                                            <Col md="5">
                                                {
                                                    item.hasImage ? 
                                                    (<Image src={item.filename} fluid thumbnail />)
                                                    :
                                                    (<div style={{textAlign: 'center'}}>No Image Uploaded Yet</div>)
                                                }
                                            </Col>
                                            <Col md="7">
                                                <div>
                                                    <p><b>Title: </b>{item.title}</p>
                                                    <p><b>Created: </b>{item.createdAt}</p>
                                                    <p><b>Description: </b>{item.description}</p>
                                                    <p><b>Detected Text: </b>{item.textContent}</p>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <small>
                                                            <Button variant="primary" size="sm" onClick={() => this._uploadModal(item)}><FaFileUpload /></Button>&nbsp;
                                                        <Button variant="warning" size="sm" onClick={() => this._create(item)}><FaPen /></Button>&nbsp;
                                                        <Button variant="danger" size="sm" onClick={async () => { await this._delImage(this.state.collection as ImageCollection, item) }}><FaTrash /></Button>
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
                <Modal show={this.state.editing} onHide={() => this._create(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="form-group row">
                                <label htmlFor="collName" className="col-4 col-form-label">Name</label>
                                <div className="col-8">
                                    <input id="imName" name="title" placeholder="Image Title" type="text" required className="form-control" value={this.state.image.title} onChange={this._updateState.bind(this)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="description" className="col-4 col-form-label">Description</label>
                                <div className="col-8">
                                    <textarea id="imDescription" name="description" className="form-control" value={this.state.image.description} onChange={this._updateState.bind(this)}></textarea>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this._create(null)}>
                            Close
              </Button>
                        <Button variant="primary" onClick={() => this._save()}>
                            {this.state.newImage ? 'Save' : 'Update'}
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.upload} onHide={() => this._uploadModal(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title><i>{this.state.image.title}</i> - Upload</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="form-group row">
                                <label htmlFor="imageUpload" className="col-4 col-form-label">Choose Image</label>
                                <div className="col-8">
                                    <input name="imageUpload" type="file" accept="image/*" placeholder="Image to upload" onChange={this._updateFile.bind(this)} />
                                </div>
                            </div>
                            {
                                this.state.uploading ?
                                    (<div style={{ textAlign: 'center' }}><Spinner animation="grow" variant="success" /></div>) : (<></>)
                            }
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this._create(null)}>
                            Close
              </Button>
                        <Button variant="primary" onClick={() => this._upload()}>Upload</Button>
                    </Modal.Footer>
                </Modal>


            </>
        )
    }
}