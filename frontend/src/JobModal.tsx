import React, { Component } from 'react'
import { Modal, Button, FormCheck, Form} from 'react-bootstrap'
import Config from './Config'
import { JobType } from './Types'

type Prop = {
    id?: number,
    triggerParentUpdate?: Function,
    triggerClose: Function
}

export default class JobModal extends Component<Prop, JobType> {
    afterPost: Function
    triggerClose: Function

    constructor(props: Prop) {
        super(props)

        this.state = {
            id: props.id ? props.id : undefined,
            address: "",
            note: "",
            driver_id: -1,
            date: new Date()
        }
        
        const afterPost = props.triggerParentUpdate ? 
                            props.triggerParentUpdate : 
                            function(){}
        this.afterPost = afterPost.bind(this)
        this.triggerClose = props.triggerClose.bind(this)
    }

    async componentDidMount(){
        if(!this.isCreate()){
            const response = await fetch(Config.hostname + `/api/job/${this.props.id}`)
            const model = (await response.json()) as JobType
            this.setState(model)
        }
    }

    async post(event: any){
        event.preventDefault()

        const postURI = this.isCreate() ?  
                    Config.hostname + `/api/job/update/${this.props.id}` : 
                    Config.hostname + `/api/job/create`
                    
        const response = await fetch(postURI, {
            method: "POST",
            mode:   "cors",
            credentials: 'include',
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                Job: this.state
            })
          })

        this.afterPost()
    }

    isCreate(){
        return !!this.props.id
    }

    render() {
        const hide = this.props.triggerClose

        return (
            <Modal
                show={true}
                backdrop="static"
                keyboard={false}
                onHide={hide}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.isCreate() ? "Create New " : "Update "}Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={_ => hide()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={e => this.post(e)}>Submit</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
