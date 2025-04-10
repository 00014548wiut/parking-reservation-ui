import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import apiCall from '../Shared/Services/apiCalls';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Shared/authContext/authContext';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const updatedData = {
            ...data, // Spread the existing data
            id: 0,
            name: "string",
            phoneNumber: "string",
            userRole: "string",
            passportCode: "string",
            passportSerial: "string",
            isActive: 1,
        };
        try {
            const resp = await apiCall({
                endpoint: '/api/Users/Login',
                method: 'POST',
                payload: updatedData,
            });
            console.log('Protected Data:', resp);
            if (resp?.id) {
                login(resp);
                if(resp?.userRole==="USER"){
                    navigate("/dashboard");
                }
                else if(resp?.userRole==="LOCALADMIN"){
                    navigate("/dashboard");
                }
                else{
                    navigate("/dashboard");
                }
            }
        } catch (error) {
            console.error('Error on Login:', error);
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
                        alt="login"
                        className="img-fluid"
                    />
                </Col>

                <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                    <div className="w-100 p-4">
                        <h2 className="text-center">Login</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
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
                                            value: 6,
                                            message: 'Password must be at least 6 characters long',
                                        },
                                    })}
                                />
                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 my-2">
                                Login
                            </Button>
                            <a href="/register" className="w-100 btn btn-success mt-2">
                                Register
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

export default Login;
