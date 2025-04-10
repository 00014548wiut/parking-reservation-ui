import React, { useContext, useState, useEffect } from "react";
import { Table, Modal, Form, Alert } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import React Icons
import { useForm } from "react-hook-form";
import apiCall from "../../Shared/Services/apiCalls";
import { AuthContext } from "../../Shared/authContext/authContext";

function Location() {
    const { user } = useContext(AuthContext); 
    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [error, setError] = useState("");

    const { register, handleSubmit, reset, setValue, formState: { errors }, getValues } = useForm();

    useEffect(() => {
        fetchLocations(); // Load locations on component mount
    }, []);

    // Fetch locations
    const fetchLocations = async () => {
        try {
            const url = user?.userRole === "LOCALADMIN" ? `/api/Locations/GetAllLocationByID?id=${user.id}` : "/api/Locations/GetAll";
            const data = await apiCall({ endpoint: url, method: "GET" });
            setLocations(data);
        } catch (err) {
            setError("Failed to load locations");
        }
    };

    // Add or update a location
    const onSubmit = async (data) => {
    
        try {
            if (editingLocation) {
                data.locationId = editingLocation.locationId;
                data.createdId = user.id;
                // Update location
                await apiCall({
                    endpoint: `/api/Locations/Update/${editingLocation.locationId}`,
                    method: "PUT",
                    payload: data,
                });
            } else {
                // Add new location
                data.createdId = user.id;
                await apiCall({
                    endpoint: "/api/Locations/Create",
                    method: "POST",
                    payload: data,
                });
            }
            fetchLocations(); // Refresh location list
            handleClose(); // Close modal
        } catch (err) {
            setError("Failed to save location");
        }
    };

    // Delete a location
    const handleDelete = async (id) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this location?");
        if (userConfirmed) {
            try {
                await apiCall({ endpoint: `/api/Locations/Delete/${id}`, method: "DELETE" });
                fetchLocations(); // Refresh location list
            } catch (err) {
                setError("Failed to delete location");
            }
        }
    };

    // Open modal for add or edit
    const handleShow = (location = null) => {
        setEditingLocation(location);
        if (location) {
            setValue("locationName", location.locationName);
            setValue("price", location.price);
            setValue("totalSpots", location.totalSpots);
            setValue("availableSpots", location.availableSpots);
        } else {
            reset();
        }
        setShowModal(true);
    };

    // Close modal
    const handleClose = () => {
        setShowModal(false);
        setEditingLocation(null);
        reset();
    };

    return (
        <div className="p-4">
            <h1>Location Management</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <button onClick={() => handleShow()} className="btn btn-primary mb-3">
                Add Location
            </button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Location ID</th>
                        <th>Location Name</th>
                        <th>Price</th>
                        <th>Total Spots</th>
                        <th>Available Spots</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location, index) => (
                        <tr key={location.locationId}>
                            <td>{index + 1}</td>
                            <td>{location.locationName}</td>
                            <td>{location.price}</td>
                            <td>{location.totalSpots}</td>
                            <td>{location.availableSpots}</td>
                            <td>
                                <FiEdit
                                    className="text-warning me-3"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleShow(location)}
                                />
                                {user?.userRole !== "LOCALADMIN" && 
                                <FiTrash2
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDelete(location.locationId)}
                                />
}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingLocation ? "Edit Location" : "Add Location"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Location Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter location name"
                                {...register("locationName", { required: "Location name is required" })}
                            />
                            {errors.locationName && <small className="text-danger">{errors.locationName.message}</small>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                {...register("price", { required: "Price is required", min: { value: 0, message: "Price cannot be negative" } })}
                            />
                            {errors.price && <small className="text-danger">{errors.price.message}</small>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Total Spots</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter total spots"
                                {...register("totalSpots", { required: "Total spots are required", min: { value: 1, message: "Must have at least one spot" } })}
                            />
                            {errors.totalSpots && <small className="text-danger">{errors.totalSpots.message}</small>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Available Spots</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter available spots"
                                {...register("availableSpots", {
                                    required: "Available spots are required",
                                    min: { value: 0, message: "Cannot be negative" },
                                    validate: (value) => parseInt(value, 10) <= parseInt(getValues("totalSpots"), 10) || "Cannot exceed total spots",
                                })}
                            />
                            {errors.availableSpots && <small className="text-danger">{errors.availableSpots.message}</small>}
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

export default Location;
