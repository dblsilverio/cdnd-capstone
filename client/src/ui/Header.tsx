import React from 'react';
import { Button, Image, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'

import logo from '../img/logo.png';
import Profile from '../components/Profile';

function Header() {

    return (
        <Navbar bg="light" expand="lg">

            <Navbar.Brand as={Link} to="/">
                <Image src={logo} width="32" height="32" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Collections</Nav.Link>
                </Nav>

            </Navbar.Collapse>
            <Profile />
            <SessionButton />
        </Navbar>
    )
}

function SessionButton() {

    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    if (isAuthenticated) {
        return (<><Button variant="danger" onClick={() => logout()}>Logout</Button></>)
    }

    return (<><Button variant="primary" onClick={() => loginWithRedirect()}>Login</Button></>)
}


export default Header;