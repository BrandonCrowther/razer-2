import React, { Component } from 'react'
import { Button, Table } from 'react-bootstrap'
import Config from './Config'
import { JobsPageProps, JobsPageState, JobType } from './Types'

export default class JobsPage extends Component<JobsPageProps, JobsPageState> {
    constructor(props: JobsPageProps){
        super(props)
        this.state = {
            jobs: [],
            isCreateModalOpen: false
        }

        this.toggleCreateModal = this.toggleCreateModal.bind(this)
    }

    async componentDidMount(){
        const response = await fetch(Config.hostname + "/api/job", {
            method: "GET",
            mode:   "cors",
            credentials: 'include',
            headers: { 
                "Content-Type": "application/json" 
            }
        })

        const json: JobType[] = await response.json()
        this.setState({jobs: json})
    }

    toggleCreateModal(){
        this.setState({isCreateModalOpen: !this.state.isCreateModalOpen})
    }



    render() {
        return (
            <div>
                {/* {isCreateModalOpen ? <UserCreateModal triggerClose={this.toggleCreateModal}/> : <></>} */}
                
                <h1>Jobs - </h1>
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
                        {/* {users.map((u: any) => <User model={u} forceUpdate={forceUpdateBound}/>)} */}
                    </tbody>
                </Table>
                <Button onClick={this.toggleCreateModal}>Create</Button>
            </div>
        )
    }
}
