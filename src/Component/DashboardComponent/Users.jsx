import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import apiCall from "../../Shared/Services/apiCalls";

function Users() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const data = await apiCall({ endpoint: "/api/Users/GetAll", method: "GET", isAuthenticated: true });
            setUsers(data); // Assuming the response is an array of users
        } catch (err) {
            setError("Failed to fetch users.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-4">
            <h1>Users Management</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>User Role</th>
                        <th>Passport Code</th>
                        <th>Passport Serial</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.userRole}</td>
                            <td>{user.passportCode}</td>
                            <td>{user.passportSerial}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Users;
