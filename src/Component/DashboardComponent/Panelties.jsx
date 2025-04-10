import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import apiCall from "../../Shared/Services/apiCalls";
import { AuthContext } from "../../Shared/authContext/authContext";

function Penalties() {
    const [penalties, setPenalties] = useState([]);
    const [reservations, setReservations] = useState([]);  // New state for reservations
    const [showModal, setShowModal] = useState(false);
    const [editingPenalty, setEditingPenalty] = useState(null);
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();
    const { user } = useContext(AuthContext);

    // Fetch penalties
    const fetchPenalties = async () => {
        try {
            const data = await apiCall({ endpoint: "/api/Penalties/GetAll", method: "GET", isAuthenticated: true });
            setPenalties(data);
        } catch (err) {
            setError("Failed to fetch penalties.");
        }
    };

    // Fetch reservations (for dropdown)
    const fetchReservations = async () => {
        try {
            const data = await apiCall({ endpoint: "/api/Reservations/GetAll", method: "GET", isAuthenticated: true });
            setReservations(data);
        } catch (err) {
            setError("Failed to fetch reservations.");
        }
    };

    useEffect(() => {
        fetchPenalties();
        if(user.userRole==="USER"){
            fetchReservations();
        }
    }, []);

    // Add or Update Penalty
    const onSubmit = async (data) => {
        try {
            const parsedData = {
                ...data,
                appliedTime: new Date(data.appliedTime).toISOString(),
                amount: parseFloat(data.amount),
            };

            if (editingPenalty) {
                data.penaltyId = editingPenalty.penaltyId
                // Update
                await apiCall({
                    endpoint: `/api/Penalties/Complete/${editingPenalty.penaltyId}`,
                    method: "PUT",
                    payload: parsedData,
                    isAuthenticated: true,
                });
                setPenalties((prev) =>
                    prev.map((penalty) =>
                        penalty.penaltyId === editingPenalty.penaltyId ? parsedData : penalty
                    )
                );
            } else {
                // Add
                const newPenalty = await apiCall({
                    endpoint: "/api/Penalties/Create",
                    method: "POST",
                    payload: parsedData,
                    isAuthenticated: true,
                });
                setPenalties((prev) => [...prev, newPenalty]);
            }

            handleClose();
        } catch (err) {
            setError("Failed to save penalty.");
        }
    };

    // Delete Penalty with confirmation
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this penalty?")) {
            try {
                apiCall({
                    endpoint: `/api/Penalties/Delete/${id}`,
                    method: "DELETE",
                    isAuthenticated: true,
                });
                setPenalties((prev) => prev.filter((penalty) => penalty.penaltyId !== id));
            } catch (err) {
                setError("Failed to delete penalty.");
            }
        }
    };

    // Open Modal for Add or Edit
    const handleShow = (penalty = null) => {
        setEditingPenalty(penalty);
        if (penalty) {
            setValue("reservationId", penalty.reservationId);
            setValue("amount", penalty.amount);
            setValue("appliedTime", new Date(penalty.appliedTime).toISOString().slice(0, 16));
        } else {
            reset();
        }
        setShowModal(true);
    };

    // Close Modal
    const handleClose = () => {
        setShowModal(false);
        setEditingPenalty(null);
        reset();
    };

    return (
        <div className="p-4">
            <h1>Penalties Management</h1>

            {/* {user?.userRole !== "ADMIN" && (
                <Button onClick={() => handleShow()} className="mb-3">
                    Add Penalty
                </Button>
            )} */}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Penalty ID</th>
                        <th>Reservation ID</th>
                        <th>Amount</th>
                        <th>Applied Time</th>
                        {user?.userRole !== "ADMIN" && (
                            <th>Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {penalties.map((penalty) => (
                        <tr key={penalty.penaltyId}>
                            <td>{penalty.penaltyId}</td>
                            <td>{penalty.reservationId}</td>
                            <td>{penalty.amount.toFixed(2)}</td>
                            <td>{new Date(penalty.appliedTime).toLocaleString()}</td>
                            {user?.userRole !== "ADMIN" && (
                                <td>
                                    {/* <FiEdit
                                        className="text-warning me-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleShow(penalty)}
                                    /> */}
                                    <FiTrash2
                                        className="text-danger"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleDelete(penalty.penaltyId)}
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingPenalty ? "Edit Penalty" : "Add Penalty"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Reservation ID</Form.Label>
                            <Form.Select
                                {...register("reservationId", { required: "Reservation ID is required" })}
                            >
                                <option value="">Select Reservation</option>
                                {reservations.map((reservation) => (
                                    <option key={reservation.reservationId} value={reservation.reservationId}>
                                        {reservation.reservationId}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.reservationId && (
                                <small className="text-danger">{errors.reservationId.message}</small>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                {...register("amount", { required: "Amount is required", min: 0 })}
                            />
                            {errors.amount && <small className="text-danger">{errors.amount.message}</small>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Applied Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                {...register("appliedTime", { required: "Applied time is required" })}
                            />
                            {errors.appliedTime && <small className="text-danger">{errors.appliedTime.message}</small>}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default Penalties;
