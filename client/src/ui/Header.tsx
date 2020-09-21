import React from 'react';
import { Button, Image, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom';

import logo from '../img/logo.png';

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
            <Button variant="info" as={Link} to="/login">Login</Button>
        </Navbar>
    )
}

export default Header;