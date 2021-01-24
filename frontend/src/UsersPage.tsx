import React from "react"
import { Button, FormControl, InputGroup, Modal, Spinner, Table } from "react-bootstrap"
import Config from './Config'
import { UserProps, UsersPageProps, UsersPageState, UserType } from "./Types"
import User from './User'
import UserModal from "./UserModal"


class UsersPage extends React.Component<UsersPageProps, UsersPageState>{

    constructor(props: UsersPageProps){
        super(props)
        this.state = {
            users: [],
            isCreateModalOpen: false
        }

        this.toggleCreateModal = this.toggleCreateModal.bind(this)
    }

    async componentDidMount(){
        const response = await fetch(Config.hostname + "/api/user", {
            method: "GET",
            mode:   "cors",
            credentials: 'include',
            headers: { 
                "Content-Type": "application/json" 
            }
        })

        const json: UserType[] = await response.json()
        this.setState({users: json})
    }

    toggleCreateModal(){
        this.setState({isCreateModalOpen: !this.state.isCreateModalOpen})
        this.componentDidMount()
    }


    render(){
        const { users, isCreateModalOpen} = this.state
        const forceUpdateBound = this.componentDidMount.bind(this)
        if(users.length === 0){
            return <Spinner animation="grow">
                <span className="sr-only">Loading...</span>
            </Spinner>
        }

        return(
        <div>
            {isCreateModalOpen ? <UserModal triggerClose={this.toggleCreateModal}/> : <></>}
            
            <h1>Users</h1>
            <Table>
                <thead>
                    <tr>
                        <td>id</td>
                        <td>role</td>
                        <td>name</td>
                        <td>email</td>
                        <td>actions</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => <User model={u} forceUpdate={forceUpdateBound}/>)}
                </tbody>
            </Table>
            <Button onClick={this.toggleCreateModal}>Create</Button>
        </div>

        )
    }




    createModal(){

    }
}



export default UsersPage