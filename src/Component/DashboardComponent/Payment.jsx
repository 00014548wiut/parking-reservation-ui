import React, { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";
import apiCall from "../../Shared/Services/apiCalls";
import { AuthContext } from "../../Shared/authContext/authContext";

function Payment() {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");

    // Fetch payments
    const fetchPayments = async () => {
        try {
            const endpoint = user?.userRole === "USER"
                ? `/api/Payments/GetPaymentByclientId/${user.id}`
                : "/api/Payments/GetAll";

            const data = await apiCall({
                endpoint,
                
                method: "GET",
                isAuthenticated: true,
            });
            setPayments(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError("Failed to fetch payments.");
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="p-4">
            <h1>Payment Management</h1>
        {user.userRole==="USER" ? 
        <Table striped bordered hover responsive>
        <thead>
            <tr>
                <th>Payment ID</th>
                <th>Car Number</th>
                <th>Location</th>
                <th>Start Time</th>
            <th>End Time</th>
            <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            {payments.map((payment) => (
                <tr key={payment.paymentId}>
                    <td>{payment.paymentId}</td>
                    <td>{payment.carNumber}</td>
                    <td>{payment.locationName}</td>
                    <td>{payment.startTime}</td>
                <td>{payment.endTime}</td>
                <td>{payment.amount}</td>
                </tr>
            ))}
        </tbody>
    </Table>
    :
    <Table striped bordered hover responsive>
    <thead>
        <tr>
            <th>Payment ID</th>
            <th>Client Name</th>
            <th>Car Number</th>
            <th>Location</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Amount</th>
        </tr>
    </thead>
    <tbody>
        {payments.map((payment) => (
            <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.clientName}</td>
                <td>{payment.carNumber}</td>
                <td>{payment.locationName}</td>
                <td>{payment.startTime}</td>
                <td>{payment.endTime}</td>
                <td>{payment.amount}</td>
            </tr>
        ))}
    </tbody>
</Table>    
    }
        </div>
    );
}

export default Payment;
