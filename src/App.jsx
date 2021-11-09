import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import {Container, Navbar, Nav, Collapse, NavDropdown } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Navbar expand="lg" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>Polina's Remote Control</Navbar.Brand>
          <Navbar.Toggle/>
          <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="Devices" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/heart">Heart</NavDropdown.Item>
              <NavDropdown.Item href="/robot">Robot</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default App;
