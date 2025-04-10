import React, { useEffect, useState } from "react";
import { Table, Alert, Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import apiCall from "../../Shared/Services/apiCalls";

function LocalAdmins() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        userRole: "LOCALADMIN",
        passportCode: "",
        passportSerial: "",
        isActive: 1,
    });

    // Fetch all local admins
    const fetchUsers = async () => {
        try {
            const data = await apiCall({
                endpoint: "/api/Users/GetAllLocalAdmins",
                method: "GET",
                isAuthenticated: true,
            });
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Open modal for add/edit
    const openModal = (user = null) => {
        if (user) {
            setFormData(user);
            setCurrentUser(user);
        } else {
            setFormData({
                id: 0,
                name: "",
                phoneNumber: "",
                email: "",
                password: "",
                userRole: "LOCALADMIN",
                passportCode: "",
                passportSerial: "",
                isActive: 1,
            });
            setCurrentUser(null);
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => setShowModal(false);

    // Save Local Admin (Add or Edit)
    const saveLocalAdmin = async () => {
        debugger
        try {
            if (currentUser) {
                // Update existing user
                await apiCall({
                    endpoint: `/api/Users/Update/${formData.id}`,
                    method: "PUT",
                    isAuthenticated: true,
                    payload: formData,
                });
                toast.success("Local Admin updated successfully!");
            } else {
                // Create new user
                await apiCall({
                    endpoint: "/api/Users/Create",
                    method: "POST",
                    isAuthenticated: true,
                    payload: formData,
                });
                toast.success("Local Admin added successfully!");
            }
            closeModal();
            fetchUsers();
        } catch (err) {
            toast.error("Error saving Local Admin.");
        }
    };

    // Delete Local Admin with confirmation
    const deleteLocalAdmin = async (id) => {
        if (window.confirm("Are you sure you want to delete this Local Admin?")) {
            try {
                await apiCall({
                    endpoint: `/api/Users/Delete/${id}`,
                    method: "DELETE",
                    isAuthenticated: true,
                });
                toast.success("Local Admin deleted successfully!");
                fetchUsers();
            } catch (err) {
                toast.error("Error deleting Local Admin.");
            }
        }
    };

    return (
        <div className="p-4">
            <h1>Local Admin Management</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button variant="primary" className="mb-3" onClick={() => openModal()}>
                + Add New Local Admin
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Passport Code</th>
                        <th>Passport Serial</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>{user.passportCode}</td>
                            <td>{user.passportSerial}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => openModal(user)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => deleteLocalAdmin(user.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Bootstrap Modal for Add/Edit */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentUser ? "Edit Local Admin" : "Add New Local Admin"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!currentUser}
                            />
                        </Form.Group>
                      
                        <Form.Group className="mb-3">
                            <Form.Label>Passport Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="passportCode"
                                value={formData.passportCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Passport Serial</Form.Label>
                            <Form.Control
                                type="text"
                                name="passportSerial"
                                value={formData.passportSerial}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={saveLocalAdmin}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LocalAdmins;
