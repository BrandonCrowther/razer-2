import React from 'react';
import './App.css';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cookies, CookiesProvider, withCookies } from 'react-cookie';
import { AppProps, AppState } from "./Types"
import jwt from 'jsonwebtoken'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import UsersPage from './UsersPage';
import { Navbar, Nav, Button } from 'react-bootstrap';

import config from './Config'


class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps){
    super(props)
    const { cookies } = this.props

    const decodedToken = jwt.decode(cookies.get("token"), {complete: true}) as any
    
    if(decodedToken)
      this.state = {loggedIn: new Date(decodedToken.payload.exp * 1000) > new Date()}
    else 
      this.state = {loggedIn: false}
    
    this.userLoggedIn = this.userLoggedIn.bind(this)
  }

  userLoggedIn(){
    this.setState({
      loggedIn: true
    })
  }

  logOut(){
    const { cookies } = this.props
    cookies.set('token', '')
    this.setState({loggedIn: false})
  }

  render(){
    const { loggedIn } = this.state
    if (loggedIn) {
      return (
        <div className="p-4 App">
          <CookiesProvider>
            <Router>
              <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#users">Razer App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/user">Users</Nav.Link>
                    <Nav.Link href="/job">Jobs</Nav.Link>
                    <Nav.Link href="/link">Clients</Nav.Link>
                </Nav>
                <Nav>
                  <Button onClick={e => this.logOut()}>Log Out</Button>
                </Nav>
                </Navbar.Collapse>
              </Navbar>
              <div className="m-5">
                <Switch>
                  <Route path="/user">
                    <UsersPage/>
                  </Route>
                  <Route path="/job">
                    <h1>ERRTYT</h1>
                  </Route>
                </Switch>
              </div>
            </Router>
          </CookiesProvider>
        </div>
      );
    }
    else{
      return (
        <div className="p-4 App">
          <CookiesProvider>
            <Login userLoggedIn={this.userLoggedIn}></Login>
          </CookiesProvider>
        </div>
      );
    }
  }
}
export default withCookies(App)