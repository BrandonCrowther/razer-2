import React, { Component } from 'react'
import { Modal, Button, FormCheck, Form} from 'react-bootstrap'
import { UserCreateModalProps, UserCreateModalState } from './Types'
import Config from './Config'

export default class UserCreateModal extends Component<UserCreateModalProps, UserCreateModalState> {
    constructor(props: UserCreateModalProps) {
        super(props)

        this.state = {
            name: '',
            role: 2,
            email: '',
            password: ''
        }
        this.registerUser = this.registerUser.bind(this)
        this.setName = this.setName.bind(this)
        this.setEmail = this.setEmail.bind(this)
        this.setPassword = this.setPassword.bind(this)
        this.setRole = this.setRole.bind(this)
    }

    async registerUser(event: any){
        event.preventDefault()

        const response = await fetch(Config.hostname + "/api/user/create", {
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

        this.props.triggerClose()
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

        return (
            <Modal
                show={true}
                backdrop="static"
                keyboard={false}
                onHide={hide}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New User</Modal.Title>
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
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setPassword(e)} 
                                type="password" 
                                placeholder="Password"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={_ => hide()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={e => this.registerUser(e)}>Submit</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
