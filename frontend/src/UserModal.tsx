import React, { Component } from 'react'
import { Modal, Button, FormCheck, Form} from 'react-bootstrap'
import Config from './Config'
import { UserType } from './Types'

type Prop = {
    id?: number,
    triggerParentUpdate?: Function,
    triggerClose: Function
}
type UserTypeWithPassword = {password?: string} & UserType

export default class UserModal extends Component<Prop, UserTypeWithPassword> {
    afterPost: Function
    triggerClose: Function

    constructor(props: Prop) {
        super(props)

        this.state = {
            id: props.id ? props.id : undefined,
            role: -1,
            name: "",
            email: "",
            password: props.id ? "": undefined,
        }
        
        const afterPost = props.triggerParentUpdate ? 
                            props.triggerParentUpdate : 
                            function(){}
        this.afterPost = afterPost.bind(this)
        this.triggerClose = props.triggerClose.bind(this)
    }

    async componentDidMount(){
        if(!this.isCreate()){
            const response = await fetch(Config.hostname + `/api/user/${this.props.id}`)
            const model = (await response.json()) as UserType
            this.setState(model)
        }
    }

    async post(event: any){
        event.preventDefault()

        const postURI = this.isCreate() ?  
                    Config.hostname + `/api/user/update/${this.props.id}` : 
                    Config.hostname + `/api/user/create`
                    
        const response = await fetch(postURI, {
            method: "POST",
            mode:   "cors",
            credentials: 'include',
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                User: this.state
            })
        })

        this.afterPost()
    }

    isCreate(){
        return !!this.props.id
    }

    setName(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({name: e.target.value})
    }

    setEmail(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({email: e.target.value})
    }

    setPassword(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({password: e.target.value})
    }

    setRole(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({role: parseInt(e.target.value)})
    }

    render() {
        const hide = this.props.triggerClose
        const isCreate = this.isCreate()

        const passwordComponent = isCreate ? 
            <Form.Group>
                <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setPassword(e)} 
                        type="password" 
                        placeholder="Password"
                    />
                </Form.Group> : 
            <></>
            

        return (
            <Modal
                show={true}
                backdrop="static"
                keyboard={false}
                onHide={hide}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.isCreate() ? "Create New User" : `Update ${this.state.name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setName(e)} 
                                type="text" 
                                placeholder="Username"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Role</Form.Label>
                            <br/>
                            <FormCheck 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setRole(e)} 
                                value={1} 
                                label="Admin" 
                                inline={true} 
                                type="radio"
                            />
                            <FormCheck 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setRole(e)} 
                                value={2} 
                                label="Regular User" 
                                inline={true} 
                                type="radio"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setEmail(e)} 
                                type="email" 
                                placeholder="Email"
                            />
                        </Form.Group>
                        {passwordComponent}
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
