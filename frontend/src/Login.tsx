import React from "react";
import { Form, Container, InputGroup, Button } from "react-bootstrap";
import Config from './Config'
import { withCookies } from 'react-cookie';
import { LoginProps, LoginState } from "./Types";


class Login extends React.Component<LoginProps, LoginState>{
  constructor(props: LoginProps){
    super(props)

    this.state = {username: "", password: ""}
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
  }

  setUsername(name: string){
    this.setState({username: name})
  }

  setPassword(name: string){
    this.setState({password: name})
  }

  async postLogin(event: React.MouseEvent){
    event.preventDefault()
    const { userLoggedIn, cookies } = this.props;
    const { username, password } = this.state

    const response = await fetch(Config.hostname + "/api/login", {
      method: "POST",
      mode:   "cors",
      credentials: 'include',
			headers: { 
				"Content-Type": "application/json" 
			},
      body: JSON.stringify({
        User: {
          username: username, 
          password: password
        }
      })
    })

    const payload = await response.json()
    cookies.set('token', payload.token, { path: '/' });
    userLoggedIn()
  }


  render(){
      return (
        <Container style={{width:"300px"}} className="">
          <Form>
            <InputGroup className="pb-3">
              <input name="User[username]" onChange={event => this.setUsername(event.target.value)} placeholder="Username" type="text"></input>
              <input name="User[password]" onChange={event => this.setPassword(event.target.value)} placeholder="Password" type="password"></input>
            </InputGroup>
            <Button onClick={event => this.postLogin(event)} type="submit">Submit</Button>
          </Form>
        </Container>
      );
  }
}

export default withCookies(Login)