/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Table, Modal, Form, Alert } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import apiCall from "../../Shared/Services/apiCalls";
import { AuthContext } from "../../Shared/authContext/authContext";

function Car() {
    const { user } = useContext(AuthContext); // Get user info from context
    const [cars, setCars] = useState([]);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [error, setError] = useState("");

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        loadUsers(); // Load all users
        fetchCars(); // Load cars specific to client
    }, []);

    // Load all users for dropdown
    const loadUsers = async () => {
        try {
            const userData = await apiCall({ endpoint: "/api/Users/GetAll", method: "GET" });
            setUsers(userData);
        } catch (err) {
            setError("Failed to load users");
        }
    };

    console.log(user, "user")
    // Fetch cars for the logged-in client
    const fetchCars = async () => {
        try {
            if (user?.id) {
                const carData = await apiCall({
                    endpoint: `/api/Cars/GetByClient/${user.id}`,
                    method: "GET",
                });
                setCars(carData);
            } else {
                setError("Client ID is missing. Unable to fetch cars.");
            }
        } catch (err) {
            setError("Failed to load cars");
        }
    };

    // Add or update a car
    const onSubmit = async (data) => {
        data.clientId = user?.id
        data.carId = editingCar?.carId
        try {
            if (editingCar) {
                // Update car
                await apiCall({
                    endpoint: `/api/Cars/Update/${editingCar.carId}`,
                    method: "PUT",
                    payload: data,
                });
            } else {
                // Add new car
                await apiCall({
                    endpoint: "/api/Cars/Create",
                    method: "POST",
                    payload: data,
                });
            }
            fetchCars(); // Refresh car list
            handleClose(); // Close modal
        } catch (err) {
            setError("Failed to save car");
        }
    };

    // Delete a car
    const handleDelete = async (id) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this car?");
        if (userConfirmed) {
            try {
                await apiCall({ endpoint: `/api/Cars/Delete/${id}`, method: "DELETE" });
                fetchCars(); // Refresh car list
            } catch (err) {
                setError("Failed to delete car");
            }
        }
    };
    

    // Open modal for add or edit
    const handleShow = (car = null) => {
        setEditingCar(car);
        if (car) {
            setValue("carNumber", car.carNumber);
            setValue("clientId", car.clientId);
        } else {
            reset();
        }
        setShowModal(true);
    };

    // Close modal
    const handleClose = () => {
        setShowModal(false);
        setEditingCar(null);
        reset();
    };

    return (
        <div className="p-4">
            <h1>Car Management</h1>

            {user?.userRole !== "ADMIN" && (
                <button onClick={() => handleShow()} className="btn btn-primary mb-3">
                    Add Car
                </button>
            )}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Car ID</th>
                        <th>Car Number</th>
                        {user?.userRole !== "ADMIN" && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => (
                        <tr key={car.carId}>
                            <td>{car.carId}</td>
                            <td>
                                {car.carNumber}
                            </td>
                            {user?.userRole !== "ADMIN" && (
                                <td>
                                    <FaEdit
                                        className="text-warning me-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleShow(car)}
                                    />
                                    <FaTrashAlt
                                        className="text-danger"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleDelete(car.carId)}
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add/Edit Car Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCar ? "Edit Car" : "Add Car"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        {/* Car Number Field */}
                        <Form.Group className="mb-3">
                            <Form.Label>Car Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter car number"
                                {...register("carNumber", { required: "Car number is required" })}
                            />
                            {errors.carNumber && <small className="text-danger">{errors.carNumber.message}</small>}
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default Car;
