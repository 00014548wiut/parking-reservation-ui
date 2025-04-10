import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavbarComponent() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container fluid>
                <Navbar.Toggle onClick={toggleSidebar} aria-controls="offcanvasNavbar" />
                <Navbar.Brand href="#home">CoreUI Dashboard</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;