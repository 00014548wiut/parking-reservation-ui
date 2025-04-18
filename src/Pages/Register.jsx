import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import apiCall from '../Shared/Services/apiCalls';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        data.isActive = 0
        data.userRole = "USER"
        try {
            const resp = await apiCall({
                endpoint: '/api/Users/Create',
                method: 'POST',
                payload: data, 
            });
            console.log('Protected Data:', resp);
            if (resp?.id) {
                toast("Register Successfully")
                navigate("/login")
            }
        } catch (error) {
            console.error('Error fetching protected data:', error);
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center p-0">
            <Row className="w-100 h-100">
                <Col
                    md={6}
                    className="d-none d-md-flex align-items-center justify-content-center bg-secondary text-white"
                >
                    <img
                        src="/images/signup.webp"
                        alt="Signup"
                        className="img-fluid"
                    />
                </Col>

                <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                    <div className="w-100 p-4">
                        <h2 className="text-center">Register With Us</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Name<span className="text-danger"> *</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <p className="text-danger">{errors.name.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Phone Number<span className="text-danger"> *</span>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter your phone number"
                                    {...register('phoneNumber', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Invalid phone number',
                                        },
                                    })}
                                />
                                {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Email<span className="text-danger"> *</span>
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                            message: 'Invalid email format',
                                        },
                                    })}
                                />
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Password<span className="text-danger"> *</span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Password must be at least 10 characters long',
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).[6,]$/,
                                            message: 'Password must contain at least one uppercase letter, one lowercase, and one number',
                                        }
                                    })}
                                />
                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Passport Code<span className="text-danger"> *</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your passport code"
                                    {...register('passportCode', { required: 'Passport code is required' })}
                                />
                                {errors.passportCode && <p className="text-danger">{errors.passportCode.message}</p>}
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Passport Serial<span className="text-danger"> *</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your passport serial"
                                    {...register('passportSerial', { required: 'Passport serial is required' })}
                                />
                                {errors.passportSerial && <p className="text-danger">{errors.passportSerial.message}</p>}
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Register
                            </Button>

                            <a href="/login" className="w-100 btn btn-success mt-2">
                                Login
                            </a>
                            <a href="/" className="w-100 btn btn-info mt-2">
                                Main Site
                            </a>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
