import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import NewGameForm from "./NewGameForm";

const NavBar = () => {
    return (
        <div>
            <Navbar bg="dark" variant="dark" className="justify-content-between">
                <Navbar.Brand href="/">
                    Chess4Life
                </Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/games">Wszystkie gry</Nav.Link>
                </Nav>
                <Nav className="flex-row">
                    <NewGameForm/>
                </Nav>
            </Navbar>
        </div>
    )
};

export default NavBar;