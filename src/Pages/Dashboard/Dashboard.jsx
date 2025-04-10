import React, { useContext } from "react";
import { Container, Row, Col, Nav, Offcanvas } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import {
  FaCar,
  FaMapMarkerAlt,
  FaHistory,
  FaCreditCard,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import "./dashboard.css";
import { AuthContext } from "../../Shared/authContext/authContext";

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);

  const [showSidebar, setShowSidebar] = React.useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      <Container fluid>
        <Row>
          <Col
            lg={2}
            md={3}
            className="d-none d-md-flex flex-column bg-light vh-100"
          >
            <div className="text-center p-3">
              <FaCar size={50} className="text-primary mb-2" />
              <h5 className="fw-bold">Car Management</h5>
            </div>
            <Nav className="flex-column p-3 flex-grow-1">
            <Nav.Link as={Link} to="/dashboard">
                <FaHistory className="me-2" /> Dashboard
              </Nav.Link>
              {user?.userRole === "ADMIN"  ? null : (
                <Nav.Link as={Link} to="/dashboard/cars">
                  <FaCar className="me-2" /> Cars
                </Nav.Link>
              )}
               {user?.userRole === "LOCALADMIN" ? (      
                <>
                <Nav.Link as={Link} to="/dashboard/locations">
                  <FaMapMarkerAlt className="me-2" /> Locations
                </Nav.Link>
                <Nav.Link as={Link} to="/dashboard/reservations">
                <FaCalendarCheck className="me-2" /> Reservations
              </Nav.Link>
                </>         
              ) : null}
              {user?.userRole === "ADMIN" ? (
                <>
                <Nav.Link as={Link} to="/dashboard/locations">
                  <FaMapMarkerAlt className="me-2" /> Locations
                </Nav.Link>             
                  <Nav.Link as={Link} to="/dashboard/users">
                    <FaUsers className="me-2" /> Users
                  </Nav.Link>
                  <Nav.Link as={Link} to="/dashboard/localadmins">
                    <FaUsers className="me-2" /> Local Admin
                  </Nav.Link>
                </>
              ) : null}
                {user?.userRole !== "LOCALADMIN" ? (  
                    <>
              <Nav.Link as={Link} to="/dashboard/parking-history">
                <FaHistory className="me-2" /> ParkingHistory
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/payments">
                <FaCreditCard className="me-2" /> Payments
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/penalties">
                <FaExclamationTriangle className="me-2" /> Penalties
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/reservations">
                <FaCalendarCheck className="me-2" /> Reservations
              </Nav.Link></>
               ) : null}
            </Nav>
            <Nav className="p-3 mt-auto">
              <Nav.Link
                as={Link}
                to="#"
                onClick={() => {
                  logout();
                }}
                className="text-danger"
              >
                <FaSignOutAlt className="me-2" /> Logout
              </Nav.Link>
            </Nav>
          </Col>
          <Col lg={10} md={9} xs={12}>
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="text-center mb-3">
            <FaCar size={50} className="text-primary mb-2" />
            <h5 className="fw-bold">Car Management</h5>
          </div>
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/dashboard/cars"
              onClick={() => setShowSidebar(false)}
            >
              <FaCar className="me-2" /> Cars
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dashboard/locations"
              onClick={() => setShowSidebar(false)}
            >
              <FaMapMarkerAlt className="me-2" /> Locations
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dashboard/parking-history"
              onClick={() => setShowSidebar(false)}
            >
              <FaHistory className="me-2" /> ParkingHistory
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dashboard/payments"
              onClick={() => setShowSidebar(false)}
            >
              <FaCreditCard className="me-2" /> Payments
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dashboard/penalties"
              onClick={() => setShowSidebar(false)}
            >
              <FaExclamationTriangle className="me-2" /> Penalties
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dashboard/reservations"
              onClick={() => setShowSidebar(false)}
            >
              <FaCalendarCheck className="me-2" /> Reservations
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dashboard/users"
              onClick={() => setShowSidebar(false)}
            >
              <FaUsers className="me-2" /> Users
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/logout"
              onClick={() => setShowSidebar(false)}
              className="text-danger"
            >
              <FaSignOutAlt className="me-2" /> Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Dashboard;
