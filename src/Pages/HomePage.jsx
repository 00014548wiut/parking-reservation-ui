import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCar, FaMapMarkerAlt, FaHistory, FaCreditCard, FaExclamationTriangle, FaCalendarCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {

    return (
        <>
            <header style={{ paddingLeft: 0 }}>
                <div
                    className='text-center bg-image bg-image-banner'
                    style={{ height: 400 }}
                >
                    <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', height: 400 }}>
                        <div className='d-flex justify-content-center align-items-center h-100'>
                            <div className='text-white'>
                                <h1 className='mb-3'>Car Parking Management</h1>
                                <h4 className='mb-3'>Car parking involves the systematic organization of vehicles in designated spaces to ensure efficient use of space and ease of accessibility. It includes solutions for reserving, managing, and monitoring parking spots, enhancing convenience for drivers and reducing congestion.</h4>
                                <Link className='btn btn-outline-light btn-lg mx-2' to='/login' role='button'>
                                    Login
                                </Link>
                                <Link className='btn btn-outline-light btn-lg mx-2' to='/register' role='button'>
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="home-page">
                <Container fluid className="my-5">
                    <Row className="mb-5">
                        <Col sm={12} md={4}>
                            <Card className="text-center h-100 shadow-lg">
                                <Card.Body>
                                    <FaCar size={50} color="blue" />
                                    {/* <img src='' /> */}
                                    <h5 className="mt-3">Cars</h5>
                                    <p>Manage and view your car details easily. Add new cars, edit existing ones, or remove cars from your fleet. Track vehicle history and performance in one place.</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={12} md={4}>
                            <Card className="text-center h-100 shadow-lg">
                                <Card.Body>
                                    <FaMapMarkerAlt size={50} color="green" />
                                    <h5 className="mt-3">Locations</h5>
                                    <p>Explore and manage car parking locations. Get details about available parking spaces, hours of operation, and booking options for each location.</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={12} md={4}>
                            <Card className="text-center h-100 shadow-lg">
                                <Card.Body>
                                    <FaHistory size={50} color="orange" />
                                    <h5 className="mt-3">Parking History</h5>
                                    <p>Review and manage your past parking history. View details about your parking sessions, including the location, date, and payment status for each session.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12} md={4}>
                            <Card className="text-center h-100 shadow-lg">
                                <Card.Body>
                                    <FaCreditCard size={50} color="purple" />
                                    <h5 className="mt-3">Payments</h5>
                                    <p>Make and manage your parking payments. Securely pay for parking sessions and keep track of your payment history in one easy-to-use interface.</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={12} md={4}>
                            <Card className="text-center h-100 shadow-lg">
                                <Card.Body>
                                    <FaExclamationTriangle size={50} color="red" />
                                    <h5 className="mt-3">Penalties</h5>
                                    <p>Check and manage your parking penalties. View any outstanding fines, pay penalties, and avoid further violations with quick access to all your penalty details.</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={12} md={4}>
                            <Card className="text-center h-100 shadow-lg">
                                <Card.Body>
                                    <FaCalendarCheck size={50} color="blue" />
                                    <h5 className="mt-3">Reservations</h5>
                                    <p>Reserve a parking spot for your car. Plan ahead by booking parking spaces in advance and guarantee a spot for your vehicle at the most convenient locations.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>

    );
};

export default HomePage;
