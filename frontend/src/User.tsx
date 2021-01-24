import React from "react"
import { Button, Modal, Form, FormCheck } from "react-bootstrap"
import { UserProps, UserState } from "./Types"
import Config from './Config'
import UserModal from "./UserModal"


class User extends React.Component<UserProps, UserState>{
    
    constructor(props: UserProps){
        super(props)
        this.state = {
            model: props.model,
            isEditing: false
        }

        this.toggleEditState = this.toggleEditState.bind(this)
        this.postDelete = this.postDelete.bind(this)
        this.postEdit = this.postEdit.bind(this)
        this.setName = this.setName.bind(this)
        this.setEmail = this.setEmail.bind(this)
        this.setRole = this.setRole.bind(this)
    }
    setName(e: React.ChangeEvent<HTMLInputElement>){
        let model = this.state.model

        let newModel = {...model}
        newModel.name = e.target.value

        this.setState({model: newModel})
    }

    setEmail(e: React.ChangeEvent<HTMLInputElement>){
        let model = this.state.model

        let newModel = {...model}
        newModel.email = e.target.value

        this.setState({model: newModel})
    }
    setRole(e: React.ChangeEvent<HTMLInputElement>){
        let model = this.state.model

        let newModel = {...model}
        newModel.role = parseInt(e.target.value)

        this.setState({model: newModel})
    }

    toggleEditState(){
        this.setState({isEditing: !this.state.isEditing})
    }

    async postDelete(){
        const {id} = this.state.model
            
        const response = await fetch(Config.hostname + "/api/user/delete/"+id, {
            method: "POST",
            mode:   "cors",
            credentials: 'include',
            headers: { 
                "Content-Type": "application/json" 
            }
        })
        console.log(response)
        this.props.forceUpdate()
    }

    async postEdit(){
        const {id} = this.state.model
        
        const response = await fetch(Config.hostname + "/api/user/update/"+id, {
            method: "POST",
            mode:   "cors",
            credentials: 'include',
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                User: this.state.model
            })
          })
        this.toggleEditState()
    }

    render(){
        const {id, role, name, email} = this.state.model
        const isEditing = this.state.isEditing

        const editModal = isEditing ? <UserModal triggerClose={this.toggleEditState}/>  : <></>

        return(
            <tr>
                {editModal}
                <td>{id}</td>
                <td>{role === 1 ? "Admin" : "Normal User"}</td>
                <td>{name}</td>
                <td>{email}</td>
                <td>
                    <a className="mr-2" href="#" onClick={this.toggleEditState}>Edit</a>|&nbsp;
                    <a className="mr-2" href="#" onClick={this.toggleEditState}>Change Password</a>|&nbsp;
                    <a className="mr-2" href={"/jobs/"+id}>View Jobs</a>|&nbsp;
                    <a className="mr-2" href="#" onClick={this.postDelete}>Delete</a>
                </td>
            </tr>
        )
    }


    editModal(){
        const {name, email, role} = this.state.model
        const isEditing = this.state.isEditing

        return <Modal
                show={isEditing}
                backdrop="static"
                keyboard={false}
                onHide={this.toggleEditState}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit User - {name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setName(e)} 
                                value={name}
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
                                checked={role === 1 ? true : false}
                                inline={true} 
                                type="radio"
                            />
                            <FormCheck 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setRole(e)} 
                                value={2} 
                                label="Regular User" 
                                checked={role === 2 ? true : false}
                                inline={true} 
                                type="radio"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setEmail(e)} 
                                value={email}
                                type="email" 
                                placeholder="Email"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.toggleEditState}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={this.postEdit}>Submit</Button>
                </Modal.Footer>
        </Modal>
    }
}

export default User